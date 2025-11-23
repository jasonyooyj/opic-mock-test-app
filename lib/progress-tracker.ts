import { TestResult } from "@/types";
import { getAllTestResults } from "./storage";

export interface TopicProgress {
  topicId: string;
  topicName: string;
  totalQuestions: number;
  answeredQuestions: number;
  averageScore?: number;
  lastPracticed?: number;
}

export interface LearningProgress {
  level: "IH" | "AL";
  totalTests: number;
  averageScore: number;
  topics: TopicProgress[];
  weakTopics: string[];
  strongTopics: string[];
}

/**
 * 주제별 학습 진행도 계산
 */
export function calculateTopicProgress(
  level: "IH" | "AL",
  topicId: string
): TopicProgress {
  const results = getAllTestResults().filter((r) => r.level === level && r.completed);
  
  let answeredQuestions = 0;
  let totalScore = 0;
  let scoreCount = 0;
  let lastPracticed: number | undefined;

  results.forEach((result) => {
    const topicQuestions = result.questions.filter((q) => q.topic === topicId);
    const topicAnswers = result.answers.filter((a) => {
      const question = result.questions.find((q) => q.id === a.questionId);
      return question?.topic === topicId;
    });

    if (topicAnswers.length > 0) {
      answeredQuestions += topicAnswers.length;
      if (result.feedback) {
        totalScore += result.feedback.overallScore;
        scoreCount++;
      }
      if (!lastPracticed || result.testDate > lastPracticed) {
        lastPracticed = result.testDate;
      }
    }
  });

  return {
    topicId,
    topicName: topicId, // Will be resolved by caller
    totalQuestions: 0, // Will be set by caller
    answeredQuestions,
    averageScore: scoreCount > 0 ? totalScore / scoreCount : undefined,
    lastPracticed,
  };
}

/**
 * 전체 학습 진행도 계산
 */
export function calculateLearningProgress(level: "IH" | "AL"): LearningProgress {
  const results = getAllTestResults().filter((r) => r.level === level && r.completed);
  
  const totalTests = results.length;
  const averageScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.feedback?.overallScore || 0), 0) /
        results.length
      : 0;

  // 주제별 진행도 계산
  const topicMap = new Map<string, TopicProgress>();
  
  results.forEach((result) => {
    result.questions.forEach((question) => {
      if (question.topic) {
        if (!topicMap.has(question.topic)) {
          topicMap.set(question.topic, {
            topicId: question.topic,
            topicName: question.topic,
            totalQuestions: 0,
            answeredQuestions: 0,
          });
        }
        const progress = topicMap.get(question.topic)!;
        progress.totalQuestions++;
        
        const hasAnswer = result.answers.some((a) => a.questionId === question.id);
        if (hasAnswer) {
          progress.answeredQuestions++;
        }
      }
    });
  });

  const topics = Array.from(topicMap.values());

  // 약한 주제와 강한 주제 식별
  const weakTopics: string[] = [];
  const strongTopics: string[] = [];

  topics.forEach((topic) => {
    if (topic.averageScore !== undefined) {
      if (topic.averageScore < 3.0) {
        weakTopics.push(topic.topicId);
      } else if (topic.averageScore >= 4.0) {
        strongTopics.push(topic.topicId);
      }
    } else if (topic.answeredQuestions === 0) {
      weakTopics.push(topic.topicId);
    }
  });

  return {
    level,
    totalTests,
    averageScore,
    topics,
    weakTopics,
    strongTopics,
  };
}

/**
 * 주제별 완료율 계산
 */
export function getTopicCompletionRate(topic: TopicProgress): number {
  if (topic.totalQuestions === 0) return 0;
  return (topic.answeredQuestions / topic.totalQuestions) * 100;
}


