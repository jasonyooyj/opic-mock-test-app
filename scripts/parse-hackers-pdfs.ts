/**
 * HACKERS OPIc PDF 파싱 스크립트
 * 실행: npx ts-node scripts/parse-hackers-pdfs.ts
 */

import { parseAllPDFs } from "../lib/pdf-parser";
import { mergeHackersQuestions } from "../lib/opic-questions";
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

  // 데이터 병합
  mergeHackersQuestions([...ihQuestions, ...alQuestions]);

  // 결과를 JSON 파일로 저장
  const outputPath = path.join(process.cwd(), "lib", "hackers-questions.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(
      {
        ih: ihQuestions,
        al: alQuestions,
        total: ihQuestions.length + alQuestions.length,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.log(`\nResults saved to: ${outputPath}`);
  console.log(`Total questions parsed: ${ihQuestions.length + alQuestions.length}`);
}

main().catch(console.error);


