import { NextRequest, NextResponse } from "next/server";
import { getQuestionsForLevel, getQuestionsByTopic } from "@/lib/opic-questions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const level = searchParams.get("level") as "IH" | "AL" | null;
  const topic = searchParams.get("topic");

  if (!level || (level !== "IH" && level !== "AL")) {
    return NextResponse.json(
      { error: "Invalid level. Must be 'IH' or 'AL'" },
      { status: 400 }
    );
  }

  let questions;
  if (topic) {
    questions = getQuestionsByTopic(level, topic);
  } else {
    questions = getQuestionsForLevel(level);
  }

  return NextResponse.json({ 
    questions, 
    level,
    topic: topic || null,
    count: questions.length 
  });
}

