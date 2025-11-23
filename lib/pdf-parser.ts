import fs from "fs";
import path from "path";
import pdf from "pdf-parse";
import { Question } from "@/types";
import { getTopicByPdfFileName } from "./topic-categories";

export interface ParsedPDFData {
  topic: string;
  questions: Question[];
  sampleAnswers: Map<string, string>; // questionId -> sampleAnswer
  usefulExpressions: string[];
}

/**
 * PDF 파일에서 텍스트 추출
 */
export async function extractTextFromPDF(pdfPath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error reading PDF ${pdfPath}:`, error);
    throw error;
  }
}

/**
 * PDF 텍스트에서 질문 추출
 * HACKERS OPIc PDF 구조에 맞춰 파싱
 */
export function extractQuestions(text: string, topic: string, level: "IH" | "AL"): Question[] {
  const questions: Question[] = [];
  
  // 질문 패턴 찾기 (예: "Q1:", "Question 1:", "질문 1:" 등)
  const questionPatterns = [
    /Q\d+[:\.]\s*(.+?)(?=Q\d+[:\.]|Sample|모범|답안|$)/gis,
    /Question\s+\d+[:\.]\s*(.+?)(?=Question\s+\d+[:\.]|Sample|모범|답안|$)/gis,
    /질문\s*\d+[:\.]\s*(.+?)(?=질문\s*\d+[:\.]|Sample|모범|답안|$)/gis,
  ];

  let questionId = 1;
  
  for (const pattern of questionPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const questionText = match[1]?.trim();
      if (questionText && questionText.length > 10) {
        // 질문 타입 추론
        let questionType: Question["type"] = "opinion";
        if (questionText.toLowerCase().includes("role") || questionText.includes("역할")) {
          questionType = "roleplay";
        } else if (questionText.toLowerCase().includes("describe") || questionText.includes("설명")) {
          questionType = "narration";
        } else if (questionText.toLowerCase().includes("summarize") || questionText.includes("요약")) {
          questionType = "summary";
        } else if (questionText.toLowerCase().includes("introduce") || questionText.includes("소개")) {
          questionType = "warmup";
        }

        questions.push({
          id: `${topic}-q${questionId++}`,
          type: questionType,
          text: questionText,
          level,
          topic,
          timeLimit: questionType === "roleplay" ? 90 : questionType === "warmup" ? 60 : 120,
        });
      }
    }
  }

  return questions;
}

/**
 * PDF 텍스트에서 모범 답안 추출
 */
export function extractSampleAnswers(text: string): Map<string, string> {
  const answers = new Map<string, string>();
  
  // 모범 답안 패턴 찾기
  const answerPatterns = [
    /Sample\s+Answer\s*\d+[:\.]\s*(.+?)(?=Sample\s+Answer\s*\d+[:\.]|Q\d+|$)/gis,
    /모범\s*답안\s*\d+[:\.]\s*(.+?)(?=모범\s*답안\s*\d+[:\.]|Q\d+|$)/gis,
    /Answer\s+\d+[:\.]\s*(.+?)(?=Answer\s+\d+[:\.]|Q\d+|$)/gis,
  ];

  let answerId = 1;
  for (const pattern of answerPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const answerText = match[1]?.trim();
      if (answerText && answerText.length > 10) {
        answers.set(`answer-${answerId++}`, answerText);
      }
    }
  }

  return answers;
}

/**
 * PDF 텍스트에서 유용한 표현 추출
 */
export function extractUsefulExpressions(text: string): string[] {
  const expressions: string[] = [];
  
  // 유용한 표현 패턴 찾기
  const expressionPatterns = [
    /Useful\s+Expressions?[:\.]\s*(.+?)(?=Q\d+|Sample|모범|$)/gis,
    /유용한\s*표현[:\.]\s*(.+?)(?=Q\d+|Sample|모범|$)/gis,
    /표현[:\.]\s*(.+?)(?=Q\d+|Sample|모범|$)/gis,
  ];

  for (const pattern of expressionPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const expressionText = match[1]?.trim();
      if (expressionText) {
        // 줄바꿈이나 구분자로 분리
        const splitExpressions = expressionText
          .split(/[•\-\*]\s*|\n+/)
          .map((e) => e.trim())
          .filter((e) => e.length > 3);
        expressions.push(...splitExpressions);
      }
    }
  }

  return [...new Set(expressions)]; // 중복 제거
}

/**
 * PDF 파일 전체 파싱
 */
export async function parsePDFFile(
  pdfPath: string,
  level: "IH" | "AL" = "IH"
): Promise<ParsedPDFData | null> {
  try {
    const fileName = path.basename(pdfPath);
    const topicInfo = getTopicByPdfFileName(fileName);
    
    if (!topicInfo) {
      console.warn(`No topic found for PDF: ${fileName}`);
      return null;
    }

    const text = await extractTextFromPDF(pdfPath);
    const questions = extractQuestions(text, topicInfo.id, level);
    const sampleAnswers = extractSampleAnswers(text);
    const usefulExpressions = extractUsefulExpressions(text);

    // 질문과 답안 매칭 (순서 기반)
    questions.forEach((question, index) => {
      const answerKey = `answer-${index + 1}`;
      if (sampleAnswers.has(answerKey)) {
        question.sampleAnswer = sampleAnswers.get(answerKey);
      }
      if (usefulExpressions.length > 0) {
        question.usefulExpressions = usefulExpressions;
      }
      // 오디오 경로 설정
      if (topicInfo.audioFileName) {
        question.audioPath = `/audio/hackers/${topicInfo.audioFileName}`;
      }
    });

    return {
      topic: topicInfo.id,
      questions,
      sampleAnswers,
      usefulExpressions,
    };
  } catch (error) {
    console.error(`Error parsing PDF ${pdfPath}:`, error);
    return null;
  }
}

/**
 * 여러 PDF 파일 일괄 파싱
 */
export async function parseAllPDFs(
  pdfDirectory: string,
  level: "IH" | "AL" = "IH"
): Promise<Question[]> {
  const allQuestions: Question[] = [];

  try {
    const files = fs.readdirSync(pdfDirectory);
    const pdfFiles = files.filter((file) => file.endsWith(".pdf"));

    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join(pdfDirectory, pdfFile);
      const parsed = await parsePDFFile(pdfPath, level);
      
      if (parsed && parsed.questions.length > 0) {
        allQuestions.push(...parsed.questions);
      }
    }
  } catch (error) {
    console.error("Error parsing PDFs:", error);
  }

  return allQuestions;
}


