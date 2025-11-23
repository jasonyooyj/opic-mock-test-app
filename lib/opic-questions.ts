import { Question } from "@/types";

export const OPIC_QUESTIONS: Record<"IH" | "AL", Question[]> = {
  IH: [
    {
      id: "ih-warmup-1",
      type: "warmup",
      text: "Please introduce yourself. Tell me about your name, where you're from, and what you do.",
      description: "자기소개를 해주세요. 이름, 출신지, 직업에 대해 말씀해주세요.",
      timeLimit: 60,
      level: "IH",
    },
    {
      id: "ih-warmup-2",
      type: "warmup",
      text: "What are your hobbies or interests? Why do you enjoy them?",
      description: "취미나 관심사에 대해 말씀해주세요. 왜 그것들을 좋아하시나요?",
      timeLimit: 60,
      level: "IH",
    },
    {
      id: "ih-roleplay-1",
      type: "roleplay",
      text: "You are at a restaurant and the food you ordered is cold. Talk to the waiter about this situation and ask for a solution.",
      description: "레스토랑에서 주문한 음식이 차갑게 나왔습니다. 웨이터에게 상황을 설명하고 해결책을 요청하세요.",
      timeLimit: 90,
      level: "IH",
    },
    {
      id: "ih-roleplay-2",
      type: "roleplay",
      text: "You need to return a product you bought online because it's defective. Call the customer service and explain the problem.",
      description: "온라인으로 구매한 제품이 불량이어서 반품해야 합니다. 고객 서비스에 전화하여 문제를 설명하세요.",
      timeLimit: 90,
      level: "IH",
    },
    {
      id: "ih-opinion-1",
      type: "opinion",
      text: "Some people prefer to work from home, while others prefer to work in an office. What is your opinion on this?",
      description: "어떤 사람들은 재택근무를 선호하고, 다른 사람들은 사무실 근무를 선호합니다. 이에 대한 의견을 말씀해주세요.",
      timeLimit: 120,
      level: "IH",
    },
    {
      id: "ih-opinion-2",
      type: "opinion",
      text: "Do you think social media has more positive or negative effects on society? Explain your reasoning.",
      description: "소셜 미디어가 사회에 긍정적인 영향이 더 큰지, 아니면 부정적인 영향이 더 큰지 생각하시나요? 이유를 설명해주세요.",
      timeLimit: 120,
      level: "IH",
    },
    {
      id: "ih-narration-1",
      type: "narration",
      text: "Describe a memorable trip you took. What happened, who was with you, and why was it memorable?",
      description: "기억에 남는 여행에 대해 설명해주세요. 무슨 일이 있었고, 누구와 함께했으며, 왜 기억에 남는지 말씀해주세요.",
      timeLimit: 120,
      level: "IH",
    },
    {
      id: "ih-narration-2",
      type: "narration",
      text: "Tell me about a time when you had to solve a difficult problem. What was the problem and how did you solve it?",
      description: "어려운 문제를 해결해야 했던 경험에 대해 말씀해주세요. 어떤 문제였고 어떻게 해결했는지 설명해주세요.",
      timeLimit: 120,
      level: "IH",
    },
  ],
  AL: [
    {
      id: "al-warmup-1",
      type: "warmup",
      text: "Please introduce yourself and tell me about your background, including your education and professional experience.",
      description: "자기소개를 해주시고, 교육 배경과 전문 경험을 포함하여 배경에 대해 말씀해주세요.",
      timeLimit: 90,
      level: "AL",
    },
    {
      id: "al-roleplay-1",
      type: "roleplay",
      text: "You are negotiating a contract with a client. The client wants to change some terms that you think are unreasonable. Discuss this professionally and try to reach a compromise.",
      description: "고객과 계약을 협상하고 있습니다. 고객이 불합리하다고 생각되는 조건을 변경하고자 합니다. 전문적으로 논의하고 타협점을 찾으세요.",
      timeLimit: 180,
      level: "AL",
    },
    {
      id: "al-roleplay-2",
      type: "roleplay",
      text: "You are a team leader and need to address a conflict between two team members. Facilitate a discussion to resolve the issue.",
      description: "팀 리더로서 두 팀원 간의 갈등을 해결해야 합니다. 문제를 해결하기 위한 논의를 진행하세요.",
      timeLimit: 180,
      level: "AL",
    },
    {
      id: "al-opinion-1",
      type: "opinion",
      text: "Some argue that artificial intelligence will replace many jobs, while others believe it will create new opportunities. What is your perspective on the future of work in the age of AI?",
      description: "일부는 인공지능이 많은 일자리를 대체할 것이라고 주장하고, 다른 사람들은 새로운 기회를 창출할 것이라고 믿습니다. AI 시대의 일의 미래에 대한 관점을 말씀해주세요.",
      timeLimit: 180,
      level: "AL",
    },
    {
      id: "al-opinion-2",
      type: "opinion",
      text: "Do you think globalization has been beneficial or harmful overall? Discuss both the advantages and disadvantages, and provide your balanced view.",
      description: "글로벌화가 전반적으로 유익했는지 해로운지 생각하시나요? 장단점을 모두 논의하고 균형 잡힌 관점을 제시해주세요.",
      timeLimit: 180,
      level: "AL",
    },
    {
      id: "al-narration-1",
      type: "narration",
      text: "Describe a complex project you managed or were involved in. Explain the challenges you faced, the strategies you used, and the outcomes.",
      description: "관리하거나 참여했던 복잡한 프로젝트에 대해 설명해주세요. 직면한 도전, 사용한 전략, 결과를 설명해주세요.",
      timeLimit: 180,
      level: "AL",
    },
    {
      id: "al-narration-2",
      type: "narration",
      text: "Tell me about a significant change you made in your life or career. What motivated you, what obstacles did you encounter, and what did you learn from the experience?",
      description: "생활이나 경력에서 만든 중요한 변화에 대해 말씀해주세요. 동기가 무엇이었고, 어떤 장애물을 만났으며, 경험에서 무엇을 배웠는지 설명해주세요.",
      timeLimit: 180,
      level: "AL",
    },
    {
      id: "al-summary-1",
      type: "summary",
      text: "Summarize a recent article or news story you read. Explain the main points and your thoughts on the topic.",
      description: "최근에 읽은 기사나 뉴스 기사를 요약해주세요. 주요 포인트와 주제에 대한 생각을 설명해주세요.",
      timeLimit: 150,
      level: "AL",
    },
  ],
};

export function getQuestionsForLevel(level: "IH" | "AL"): Question[] {
  const questions = OPIC_QUESTIONS[level];
  // Note: Sample answers are loaded separately via API or server-side only
  return questions;
}

export function getQuestionById(id: string): Question | undefined {
  for (const questions of Object.values(OPIC_QUESTIONS)) {
    const question = questions.find((q) => q.id === id);
    if (question) {
      // Note: Sample answers are loaded separately via API or server-side only
      return question;
    }
  }
  return undefined;
}

export function getQuestionsByTopic(level: "IH" | "AL", topic: string): Question[] {
  const questions = OPIC_QUESTIONS[level].filter((q) => q.topic === topic);
  // Note: Sample answers are loaded separately via API or server-side only
  return questions;
}

export function getAllTopics(level: "IH" | "AL"): string[] {
  const topics = new Set<string>();
  OPIC_QUESTIONS[level].forEach((q) => {
    if (q.topic) topics.add(q.topic);
  });
  return Array.from(topics);
}

// HACKERS 데이터를 기존 질문에 병합
export function mergeHackersQuestions(hackersQuestions: Question[]): void {
  // Note: Sample answers are loaded separately via API or server-side only
  hackersQuestions.forEach((hq) => {
    const level = hq.level;
    const existingIndex = OPIC_QUESTIONS[level].findIndex((q) => q.id === hq.id);
    
    if (existingIndex >= 0) {
      // 기존 질문 업데이트
      OPIC_QUESTIONS[level][existingIndex] = {
        ...OPIC_QUESTIONS[level][existingIndex],
        ...hq,
      };
    } else {
      // 새 질문 추가
      OPIC_QUESTIONS[level].push(hq);
    }
  });
}

