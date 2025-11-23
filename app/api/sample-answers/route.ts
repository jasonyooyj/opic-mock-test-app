import { NextRequest, NextResponse } from "next/server";
import {
  getSampleAnswer,
  saveSampleAnswer,
  getAllSampleAnswers,
  saveSampleAnswers,
  deleteSampleAnswer,
  updateAnswerQuality,
  getUnverifiedAnswers,
} from "@/lib/sample-answers";

/**
 * GET: 질문 ID로 모범 답안 조회
 * Query params: questionId (optional) - 제공 시 특정 질문의 답안만 조회
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const questionId = searchParams.get("questionId");
    const unverifiedOnly = searchParams.get("unverifiedOnly") === "true";

    if (questionId) {
      // 특정 질문의 답안 조회
      const answer = getSampleAnswer(questionId);
      if (!answer) {
        return NextResponse.json(
          { success: false, error: "Sample answer not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        questionId,
        answer,
      });
    }

    if (unverifiedOnly) {
      // 검증되지 않은 답안만 조회
      const unverified = getUnverifiedAnswers();
      return NextResponse.json({
        success: true,
        count: unverified.length,
        answers: unverified,
      });
    }

    // 전체 답안 조회
    const allAnswers = getAllSampleAnswers();
    return NextResponse.json({
      success: true,
      count: Object.keys(allAnswers).length,
      answers: allAnswers,
    });
  } catch (error) {
    console.error("Error getting sample answers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST: 모범 답안 저장/업데이트
 * Body: { questionId, answer, source?, quality? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, answer, source = "manual", quality = "unverified" } = body;

    if (!questionId || !answer) {
      return NextResponse.json(
        {
          success: false,
          error: "questionId and answer are required",
        },
        { status: 400 }
      );
    }

    saveSampleAnswer(questionId, answer, source, quality);

    return NextResponse.json({
      success: true,
      message: "Sample answer saved",
      questionId,
    });
  } catch (error) {
    console.error("Error saving sample answer:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT: 일괄 답안 업데이트
 * Body: { answers: [{ questionId, answer, source?, quality? }], ... }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, source = "manual", quality = "unverified" } = body;

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        {
          success: false,
          error: "answers must be an array",
        },
        { status: 400 }
      );
    }

    const answersMap = new Map<string, string>();
    for (const item of answers) {
      if (item.questionId && item.answer) {
        answersMap.set(item.questionId, item.answer);
      }
    }

    if (answersMap.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid answers provided",
        },
        { status: 400 }
      );
    }

    saveSampleAnswers(answersMap, source, quality);

    return NextResponse.json({
      success: true,
      message: `${answersMap.size} sample answers saved`,
      count: answersMap.size,
    });
  } catch (error) {
    console.error("Error updating sample answers:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 모범 답안 삭제
 * Query params: questionId
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const questionId = searchParams.get("questionId");

    if (!questionId) {
      return NextResponse.json(
        {
          success: false,
          error: "questionId is required",
        },
        { status: 400 }
      );
    }

    const deleted = deleteSampleAnswer(questionId);
    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample answer not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Sample answer deleted",
      questionId,
    });
  } catch (error) {
    console.error("Error deleting sample answer:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH: 답안 검증 상태 업데이트
 * Body: { questionId, quality }
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, quality } = body;

    if (!questionId || !quality) {
      return NextResponse.json(
        {
          success: false,
          error: "questionId and quality are required",
        },
        { status: 400 }
      );
    }

    if (quality !== "verified" && quality !== "unverified") {
      return NextResponse.json(
        {
          success: false,
          error: "quality must be 'verified' or 'unverified'",
        },
        { status: 400 }
      );
    }

    const updated = updateAnswerQuality(questionId, quality);
    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: "Sample answer not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Answer quality updated",
      questionId,
      quality,
    });
  } catch (error) {
    console.error("Error updating answer quality:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

