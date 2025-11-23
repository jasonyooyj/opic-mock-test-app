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
 * 질문-답안 쌍 정보
 */
export interface QuestionAnswerPair {
  questionNumber: number;
  questionText: string;
  answerNumber: number;
  answerText: string;
}

/**
 * PDF 텍스트에서 질문 추출 (개선된 버전)
 * HACKERS OPIc PDF 구조에 맞춰 파싱하며 질문 번호를 함께 추출
 */
export function extractQuestions(text: string, topic: string, level: "IH" | "AL"): Question[] {
  const questions: Question[] = [];
  
  // 질문 패턴 찾기 (질문 번호도 함께 추출)
  const questionPatterns = [
    /(?:Q|Question)\s*(\d+)[:\.]\s*(.+?)(?=(?:Q|Question)\s*\d+[:\.]|Sample|모범|답안|$)/gis,
    /질문\s*(\d+)[:\.]\s*(.+?)(?=질문\s*\d+[:\.]|Sample|모범|답안|$)/gis,
  ];

  const foundQuestions = new Map<number, string>();
  
  for (const pattern of questionPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const questionNumber = parseInt(match[1], 10);
      const questionText = match[2]?.trim();
      if (questionText && questionText.length > 10 && !foundQuestions.has(questionNumber)) {
        foundQuestions.set(questionNumber, questionText);
      }
    }
  }

  // 번호 순서대로 정렬하여 질문 생성
  const sortedNumbers = Array.from(foundQuestions.keys()).sort((a, b) => a - b);
  
  for (const questionNumber of sortedNumbers) {
    const questionText = foundQuestions.get(questionNumber)!;
    
    // 질문 타입 추론
    let questionType: Question["type"] = "opinion";
    const lowerText = questionText.toLowerCase();
    if (lowerText.includes("role") || questionText.includes("역할") || lowerText.includes("role-play")) {
      questionType = "roleplay";
    } else if (lowerText.includes("describe") || questionText.includes("설명") || lowerText.includes("tell me about")) {
      questionType = "narration";
    } else if (lowerText.includes("summarize") || questionText.includes("요약")) {
      questionType = "summary";
    } else if (lowerText.includes("introduce") || questionText.includes("소개") || lowerText.includes("tell me about yourself")) {
      questionType = "warmup";
    }

    questions.push({
      id: `${topic}-q${questionNumber}`,
      type: questionType,
      text: questionText,
      level,
      topic,
      timeLimit: questionType === "roleplay" ? 90 : questionType === "warmup" ? 60 : 120,
    });
  }

  return questions;
}

/**
 * PDF 텍스트에서 모범 답안 추출 (개선된 버전)
 * 답안 번호를 명시적으로 추출하여 질문과 정확히 매칭
 */
export function extractSampleAnswers(text: string): Map<number, string> {
  const answers = new Map<number, string>();
  
  // 모범 답안 패턴 찾기 (답안 번호도 함께 추출)
  const answerPatterns = [
    /(?:Sample\s+Answer|Answer)\s*(\d+)[:\.]\s*(.+?)(?=(?:Sample\s+Answer|Answer)\s*\d+[:\.]|Q\d+|질문\s*\d+|$)/gis,
    /모범\s*답안\s*(\d+)[:\.]\s*(.+?)(?=모범\s*답안\s*\d+[:\.]|Q\d+|질문\s*\d+|$)/gis,
  ];

  for (const pattern of answerPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      const answerNumber = parseInt(match[1], 10);
      const answerText = match[2]?.trim();
      if (answerText && answerText.length > 10) {
        // 중복 방지: 같은 번호가 있으면 더 긴 답안 선택
        const existingAnswer = answers.get(answerNumber);
        if (!existingAnswer || answerText.length > existingAnswer.length) {
          answers.set(answerNumber, answerText);
        }
      }
    }
  }

  return answers;
}

/**
 * 질문과 답안을 번호 기반으로 매칭
 */
export function matchQuestionsWithAnswers(
  questions: Question[],
  answers: Map<number, string>
): Map<string, string> {
  const matchedAnswers = new Map<string, string>();
  
  for (const question of questions) {
    // 질문 ID에서 번호 추출 (예: "school-q1" -> 1)
    const numberMatch = question.id.match(/-q(\d+)$/);
    if (numberMatch) {
      const questionNumber = parseInt(numberMatch[1], 10);
      const answer = answers.get(questionNumber);
      if (answer) {
        matchedAnswers.set(question.id, answer);
      }
    }
  }
  
  return matchedAnswers;
}

/**
 * 답안 품질 검증
 */
export function validateAnswerQuality(answerText: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // 최소 길이 검증
  if (answerText.length < 20) {
    issues.push("답안이 너무 짧습니다 (최소 20자 필요)");
  }
  
  // 최대 길이 검증 (너무 긴 경우 잘못된 추출일 수 있음)
  if (answerText.length > 5000) {
    issues.push("답안이 비정상적으로 깁니다 (5000자 초과)");
  }
  
  // 불완전한 문장 검증 (마지막이 마침표로 끝나지 않는 경우)
  const trimmed = answerText.trim();
  if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
    issues.push("답안이 불완전해 보입니다 (마침표로 끝나지 않음)");
  }
  
  // 너무 많은 줄바꿈 (잘못된 추출 가능성)
  const lineBreaks = (answerText.match(/\n/g) || []).length;
  if (lineBreaks > answerText.length / 50) {
    issues.push("답안에 비정상적으로 많은 줄바꿈이 있습니다");
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
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

    // 질문과 답안 매칭 (번호 기반)
    const matchedAnswers = matchQuestionsWithAnswers(questions, sampleAnswers);
    
    questions.forEach((question) => {
      const answerText = matchedAnswers.get(question.id);
      if (answerText) {
        // 답안 품질 검증
        const validation = validateAnswerQuality(answerText);
        if (validation.isValid) {
          question.sampleAnswer = answerText;
        } else {
          console.warn(`Answer quality issues for ${question.id}:`, validation.issues);
          // 검증 실패해도 저장 (수동 보완 가능하도록)
          question.sampleAnswer = answerText;
        }
      }
      
      if (usefulExpressions.length > 0) {
        question.usefulExpressions = usefulExpressions;
      }
      // 오디오 경로 설정
      if (topicInfo.audioFileName) {
        question.audioPath = `/audio/hackers/${topicInfo.audioFileName}`;
      }
    });
    
    // 매칭된 답안을 Map 형식으로 변환하여 반환
    const sampleAnswersMap = new Map<string, string>();
    matchedAnswers.forEach((answer, questionId) => {
      sampleAnswersMap.set(questionId, answer);
    });

    return {
      topic: topicInfo.id,
      questions,
      sampleAnswers: sampleAnswersMap,
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



