import { NextRequest, NextResponse } from "next/server";
import { getAllTopics, getTopicsByCategory } from "@/lib/topic-categories";
import { getAllTopics as getQuestionTopics } from "@/lib/opic-questions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") as "main" | "surprise" | "roleplay" | "summary" | null;
  const level = searchParams.get("level") as "IH" | "AL" | null;

  let topics;
  if (category) {
    topics = getTopicsByCategory(category);
  } else {
    topics = getAllTopics();
  }

  // 질문이 있는 주제만 필터링 (선택사항)
  if (level) {
    const questionTopics = getQuestionTopics(level);
    topics = topics.filter((topic) => questionTopics.includes(topic.id));
  }

  return NextResponse.json({
    topics,
    count: topics.length,
  });
}


