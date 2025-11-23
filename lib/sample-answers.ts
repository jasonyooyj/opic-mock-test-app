import fs from "fs";
import path from "path";
import { Question } from "@/types";

/**
 * 모범 답안 데이터 구조
 */
export interface SampleAnswerData {
  text: string;
  source: "pdf" | "manual" | "ai";
  quality: "verified" | "unverified";
  extractedAt?: string;
  updatedAt?: string;
}

/**
 * 모범 답안 저장소 (JSON 파일 기반)
 */
export interface SampleAnswersStore {
  [questionId: string]: SampleAnswerData;
}

const STORAGE_FILE = path.join(process.cwd(), "lib", "sample-answers.json");

/**
 * 저장소 파일 로드
 */
function loadStore(): SampleAnswersStore {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const content = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Error loading sample answers store:", error);
  }
  return {};
}

/**
 * 저장소 파일 저장
 */
function saveStore(store: SampleAnswersStore): void {
  try {
    // 디렉토리가 없으면 생성
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving sample answers store:", error);
    throw error;
  }
}

/**
 * 질문 ID로 모범 답안 조회
 */
export function getSampleAnswer(questionId: string): SampleAnswerData | null {
  const store = loadStore();
  return store[questionId] || null;
}

/**
 * 모범 답안 저장/업데이트
 */
export function saveSampleAnswer(
  questionId: string,
  answer: string,
  source: "pdf" | "manual" | "ai" = "pdf",
  quality: "verified" | "unverified" = "unverified"
): void {
  const store = loadStore();
  const existing = store[questionId];
  
  store[questionId] = {
    text: answer,
    source,
    quality,
    extractedAt: existing?.extractedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  saveStore(store);
}

/**
 * 전체 모범 답안 조회
 */
export function getAllSampleAnswers(): SampleAnswersStore {
  return loadStore();
}

/**
 * 여러 질문에 대한 모범 답안 일괄 저장
 */
export function saveSampleAnswers(
  answers: Map<string, string>,
  source: "pdf" | "manual" | "ai" = "pdf",
  quality: "verified" | "unverified" = "unverified"
): void {
  const store = loadStore();
  const now = new Date().toISOString();
  
  answers.forEach((answerText, questionId) => {
    const existing = store[questionId];
    store[questionId] = {
      text: answerText,
      source,
      quality,
      extractedAt: existing?.extractedAt || now,
      updatedAt: now,
    };
  });
  
  saveStore(store);
}

/**
 * 질문과 답안 매칭 및 저장
 */
export function matchAnswersToQuestions(
  questions: Question[],
  answers: Map<string, string>
): Map<string, string> {
  const matched = new Map<string, string>();
  
  questions.forEach((question) => {
    const answer = answers.get(question.id);
    if (answer) {
      matched.set(question.id, answer);
    }
  });
  
  return matched;
}

/**
 * 질문에 저장된 모범 답안 로드
 */
export function loadSampleAnswersForQuestions(questions: Question[]): Question[] {
  const store = loadStore();
  
  return questions.map((question) => {
    const answerData = store[question.id];
    if (answerData) {
      return {
        ...question,
        sampleAnswer: answerData.text,
        sampleAnswerSource: answerData.source,
        sampleAnswerQuality: answerData.quality,
      };
    }
    return question;
  });
}

/**
 * 모범 답안 삭제
 */
export function deleteSampleAnswer(questionId: string): boolean {
  const store = loadStore();
  if (store[questionId]) {
    delete store[questionId];
    saveStore(store);
    return true;
  }
  return false;
}

/**
 * 검증되지 않은 답안 목록 조회
 */
export function getUnverifiedAnswers(): Array<{ questionId: string; data: SampleAnswerData }> {
  const store = loadStore();
  return Object.entries(store)
    .filter(([_, data]) => data.quality === "unverified")
    .map(([questionId, data]) => ({ questionId, data }));
}

/**
 * 답안 검증 상태 업데이트
 */
export function updateAnswerQuality(
  questionId: string,
  quality: "verified" | "unverified"
): boolean {
  const store = loadStore();
  if (store[questionId]) {
    store[questionId].quality = quality;
    store[questionId].updatedAt = new Date().toISOString();
    saveStore(store);
    return true;
  }
  return false;
}

