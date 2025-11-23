import { NextRequest, NextResponse } from "next/server";
import { parseAllPDFs } from "@/lib/pdf-parser";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { pdfDirectory, level } = await request.json();
    
    // 기본 경로 설정
    const defaultPdfPath = path.join(process.cwd(), "HACKERS OPIc PDF");
    const pdfPath = pdfDirectory || defaultPdfPath;
    const testLevel = (level as "IH" | "AL") || "IH";

    const questions = await parseAllPDFs(pdfPath, testLevel);

    return NextResponse.json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("Error parsing PDFs:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}


