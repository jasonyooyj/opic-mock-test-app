/**
 * HACKERS OPIc PDF 파싱 스크립트
 * 실행: npx ts-node scripts/parse-hackers-pdfs.ts
 */

import { parseAllPDFs, parsePDFFile } from "../lib/pdf-parser";
import { mergeHackersQuestions } from "../lib/opic-questions";
import { saveSampleAnswers, getAllSampleAnswers } from "../lib/sample-answers";
import { validateAnswerQuality } from "../lib/pdf-parser";
import path from "path";
import fs from "fs";

async function main() {
  const pdfDirectory = path.join(process.cwd(), "HACKERS OPIc PDF");
  
  console.log("Starting PDF parsing...");
  console.log(`PDF Directory: ${pdfDirectory}`);

  if (!fs.existsSync(pdfDirectory)) {
    console.error(`PDF directory not found: ${pdfDirectory}`);
    process.exit(1);
  }

  // IH 레벨 질문 파싱
  console.log("\nParsing IH level questions...");
  const ihQuestions = await parseAllPDFs(pdfDirectory, "IH");
  console.log(`Found ${ihQuestions.length} IH questions`);

  // AL 레벨 질문 파싱
  console.log("\nParsing AL level questions...");
  const alQuestions = await parseAllPDFs(pdfDirectory, "AL");
  console.log(`Found ${alQuestions.length} AL questions`);

  // 모든 질문에서 모범 답안 수집 및 저장
  console.log("\nCollecting sample answers...");
  const allQuestions = [...ihQuestions, ...alQuestions];
  const answersMap = new Map<string, string>();
  const unmatchedQuestions: string[] = [];
  const invalidAnswers: Array<{ questionId: string; issues: string[] }> = [];

  allQuestions.forEach((question) => {
    if (question.sampleAnswer) {
      // 답안 품질 검증
      const validation = validateAnswerQuality(question.sampleAnswer);
      if (validation.isValid) {
        answersMap.set(question.id, question.sampleAnswer);
      } else {
        invalidAnswers.push({
          questionId: question.id,
          issues: validation.issues,
        });
        // 검증 실패해도 저장 (수동 보완 가능하도록)
        answersMap.set(question.id, question.sampleAnswer);
      }
    } else {
      unmatchedQuestions.push(question.id);
    }
  });

  // 모범 답안 저장
  if (answersMap.size > 0) {
    saveSampleAnswers(answersMap, "pdf", "unverified");
    console.log(`✓ Saved ${answersMap.size} sample answers`);
  }

  // 매칭 실패 및 검증 이슈 로깅
  if (unmatchedQuestions.length > 0) {
    console.log(`\n⚠ Warning: ${unmatchedQuestions.length} questions without sample answers:`);
    unmatchedQuestions.slice(0, 10).forEach((id) => {
      console.log(`  - ${id}`);
    });
    if (unmatchedQuestions.length > 10) {
      console.log(`  ... and ${unmatchedQuestions.length - 10} more`);
    }
  }

  if (invalidAnswers.length > 0) {
    console.log(`\n⚠ Warning: ${invalidAnswers.length} answers with quality issues:`);
    invalidAnswers.slice(0, 5).forEach(({ questionId, issues }) => {
      console.log(`  - ${questionId}: ${issues.join(", ")}`);
    });
    if (invalidAnswers.length > 5) {
      console.log(`  ... and ${invalidAnswers.length - 5} more`);
    }
  }

  // 데이터 병합
  mergeHackersQuestions(allQuestions);

  // 결과를 JSON 파일로 저장
  const outputPath = path.join(process.cwd(), "lib", "hackers-questions.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        ih: ihQuestions,
        al: alQuestions,
        total: ihQuestions.length + alQuestions.length,
        stats: {
          totalQuestions: allQuestions.length,
          questionsWithAnswers: answersMap.size,
          questionsWithoutAnswers: unmatchedQuestions.length,
          answersWithIssues: invalidAnswers.length,
        },
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`\n✓ Results saved to: ${outputPath}`);
  console.log(`✓ Total questions parsed: ${allQuestions.length}`);
  console.log(`✓ Sample answers saved: ${answersMap.size}`);
  
  // 저장된 답안 통계
  const storedAnswers = getAllSampleAnswers();
  console.log(`✓ Total stored sample answers: ${Object.keys(storedAnswers).length}`);
}

main().catch(console.error);



