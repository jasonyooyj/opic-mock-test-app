import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Question, Answer, Feedback } from "@/types";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TranscriptionResult {
  text: string;
  words?: Array<{ word: string; start: number; end: number }>;
  language: string;
  duration: number;
}

interface AudioAnalysis {
  wordsPerMinute: number;
  pausePatterns: number[];
  speechRate: 'slow' | 'normal' | 'fast';
  hesitationCount: number;
  averagePauseDuration: number;
  totalPauseTime: number;
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
async function transcribeWithWhisper(
  audioData: string,
  audioMimeType: string,
  openai: OpenAI
): Promise<TranscriptionResult> {
  try {
    // Remove data URL prefix if present
    const base64Data = audioData.includes(',') 
      ? audioData.split(',')[1] 
      : audioData;
    
    // Convert base64 to buffer
    const audioBuffer = Buffer.from(base64Data, 'base64');
    
    // Create a File-like object for OpenAI API
    const audioFile = new File([audioBuffer], 'audio.webm', { 
      type: audioMimeType || 'audio/webm' 
    });

    // Call Whisper API with verbose_json to get word-level timestamps
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    return {
      text: transcription.text,
      words: (transcription as any).words || [],
      language: transcription.language || "en",
      duration: transcription.duration || 0,
    };
  } catch (error) {
    console.error("Whisper transcription error:", error);
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyze audio metadata from transcription
 */
function analyzeAudioMetadata(
  transcript: TranscriptionResult,
  duration: number
): AudioAnalysis {
  const words = transcript.words || [];
  const wordCount = transcript.text.split(/\s+/).filter(w => w.length > 0).length;
  
  // Calculate words per minute
  const wordsPerMinute = duration > 0 ? (wordCount / duration) * 60 : 0;
  
  // Analyze pause patterns (gaps between words > 0.3s)
  const pausePatterns: number[] = [];
  let totalPauseTime = 0;
  
  if (words.length > 1) {
    for (let i = 1; i < words.length; i++) {
      const pauseDuration = words[i].start - words[i - 1].end;
      if (pauseDuration > 0.3) {
        pausePatterns.push(pauseDuration);
        totalPauseTime += pauseDuration;
      }
    }
  }
  
  // Count hesitations (long pauses > 1s or filler words)
  const hesitationCount = pausePatterns.filter(p => p > 1.0).length;
  const fillerWords = (transcript.text.match(/\b(um|uh|er|ah|like|you know)\b/gi) || []).length;
  const totalHesitations = hesitationCount + fillerWords;
  
  // Calculate average pause duration
  const averagePauseDuration = pausePatterns.length > 0 
    ? totalPauseTime / pausePatterns.length 
    : 0;
  
  // Determine speech rate
  let speechRate: 'slow' | 'normal' | 'fast';
  if (wordsPerMinute < 100) {
    speechRate = 'slow';
  } else if (wordsPerMinute > 180) {
    speechRate = 'fast';
  } else {
    speechRate = 'normal';
  }
  
  return {
    wordsPerMinute: Math.round(wordsPerMinute),
    pausePatterns,
    speechRate,
    hesitationCount: totalHesitations,
    averagePauseDuration: Math.round(averagePauseDuration * 100) / 100,
    totalPauseTime: Math.round(totalPauseTime * 100) / 100,
  };
}

/**
 * Create comprehensive evaluation prompt with ACTFL guidelines
 */
async function createOPIcEvaluationPrompt(
  questions: Question[],
  answers: Answer[],
  transcripts: Array<TranscriptionResult | null>,
  audioAnalyses: Array<AudioAnalysis | null>,
  level: "IH" | "AL"
): Promise<string> {
  let prompt = `You are an expert OPIc (Oral Proficiency Interview - computer) evaluator certified by ACTFL. Evaluate the following test responses according to ACTFL Proficiency Guidelines for level ${level}.\n\n`;

  // Add level-specific expectations
  const levelExpectations = level === "AL" ? `
For ADVANCED LOW (AL) level, expect:
- Paragraph-length responses with detailed explanations
- Use of complex grammar structures (subordinate clauses, conditionals, etc.)
- Sophisticated vocabulary and idiomatic expressions
- Natural, native-like pronunciation with minimal accent
- Minimal errors that don't impede communication
- Ability to discuss abstract topics and hypothetical situations
` : `
For INTERMEDIATE HIGH (IH) level, expect:
- Sentence-length responses with some detail
- Basic to intermediate grammar structures
- Adequate vocabulary for familiar topics
- Clear pronunciation with some accent
- Occasional errors that may require clarification
- Ability to handle routine situations and familiar topics
`;

  prompt += levelExpectations;
  prompt += `\nEvaluation Criteria (rate each 0-5):\n`;
  prompt += `- Fluency: Natural flow, appropriate pace, minimal hesitation\n`;
  prompt += `- Accuracy: Correctness of grammar and vocabulary usage\n`;
  prompt += `- Vocabulary: Range, precision, and appropriateness of word choice\n`;
  prompt += `- Grammar: Structural complexity and correctness\n`;
  prompt += `- Pronunciation: Clarity, accent, and intelligibility\n\n`;

  // Add questions and answers with analysis
  prompt += `QUESTIONS AND RESPONSES:\n`;
  prompt += `${'='.repeat(80)}\n\n`;

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answer = answers[i];
    const transcript = transcripts[i];
    const audioAnalysis = audioAnalyses[i];

    prompt += `Question ${i + 1} (${question.type}):\n`;
    prompt += `${question.text}\n\n`;

    if (answer && transcript) {
      prompt += `User Response (Transcribed):\n`;
      prompt += `${transcript.text}\n\n`;

      if (audioAnalysis) {
        prompt += `Audio Analysis:\n`;
        prompt += `- Words per minute: ${audioAnalysis.wordsPerMinute}\n`;
        prompt += `- Speech rate: ${audioAnalysis.speechRate}\n`;
        prompt += `- Hesitation count: ${audioAnalysis.hesitationCount}\n`;
        prompt += `- Average pause duration: ${audioAnalysis.averagePauseDuration}s\n`;
        prompt += `- Total pause time: ${audioAnalysis.totalPauseTime}s\n\n`;
      }

      prompt += `Response duration: ${answer.duration.toFixed(1)}s\n\n`;
    } else if (answer && answer.transcript) {
      prompt += `User Response:\n`;
      prompt += `${answer.transcript}\n\n`;
      prompt += `Response duration: ${answer.duration.toFixed(1)}s\n\n`;
    } else {
      prompt += `No response provided.\n\n`;
    }

    prompt += `${'-'.repeat(80)}\n\n`;
  }

  prompt += `\nProvide a comprehensive evaluation in JSON format with the following structure:\n`;
  prompt += `{\n`;
  prompt += `  "overallScore": <number 0-5>,\n`;
  prompt += `  "criteria": {\n`;
  prompt += `    "fluency": <number 0-5>,\n`;
  prompt += `    "accuracy": <number 0-5>,\n`;
  prompt += `    "vocabulary": <number 0-5>,\n`;
  prompt += `    "grammar": <number 0-5>,\n`;
  prompt += `    "pronunciation": <number 0-5>\n`;
  prompt += `  },\n`;
  prompt += `  "strengths": [<array of strings>],\n`;
  prompt += `  "weaknesses": [<array of strings>],\n`;
  prompt += `  "suggestions": [<array of strings>],\n`;
  prompt += `  "detailedFeedback": "<comprehensive text feedback>"\n`;
  prompt += `}\n`;

  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    const { questions, answers, level } = await request.json();

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Questions array is required" },
        { status: 400 }
      );
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Answers array is required" },
        { status: 400 }
      );
    }

    if (!level || (level !== "IH" && level !== "AL")) {
      return NextResponse.json(
        { error: "Level must be 'IH' or 'AL'" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Process each answer: transcribe if needed and analyze audio
    const transcripts: Array<TranscriptionResult | null> = [];
    const audioAnalyses: Array<AudioAnalysis | null> = [];

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      
      if (answer.audioData && !answer.transcript) {
        // Transcribe audio using Whisper
        try {
          const transcript = await transcribeWithWhisper(
            answer.audioData,
            answer.audioMimeType || "audio/webm",
            openai
          );
          transcripts.push(transcript);
          
          // Analyze audio metadata
          const analysis = analyzeAudioMetadata(transcript, answer.duration);
          audioAnalyses.push(analysis);
        } catch (error) {
          console.error(`Error processing answer ${i}:`, error);
          transcripts.push(null);
          audioAnalyses.push(null);
        }
      } else if (answer.transcript) {
        // Use existing transcript
        const transcript: TranscriptionResult = {
          text: answer.transcript,
          language: "en",
          duration: answer.duration,
        };
        transcripts.push(transcript);
        
        // Analyze audio metadata from transcript
        const analysis = analyzeAudioMetadata(transcript, answer.duration);
        audioAnalyses.push(analysis);
      } else {
        // No audio or transcript
        transcripts.push(null);
        audioAnalyses.push(null);
      }
    }

    // Create evaluation prompt
    const evaluationPrompt = await createOPIcEvaluationPrompt(
      questions,
      answers,
      transcripts,
      audioAnalyses,
      level
    );

    // Call GPT-4o-mini for evaluation
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert OPIc evaluator certified by ACTFL. Evaluate responses according to ACTFL Proficiency Guidelines. Provide detailed, constructive feedback in JSON format.",
        },
        {
          role: "user",
          content: evaluationPrompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    let feedback: Feedback;
    try {
      feedback = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse feedback:", parseError);
      throw new Error("Invalid response format from OpenAI");
    }

    // Validate feedback structure
    if (
      typeof feedback.overallScore !== "number" ||
      !feedback.criteria ||
      typeof feedback.criteria.fluency !== "number" ||
      typeof feedback.criteria.accuracy !== "number" ||
      typeof feedback.criteria.vocabulary !== "number" ||
      typeof feedback.criteria.grammar !== "number" ||
      typeof feedback.criteria.pronunciation !== "number"
    ) {
      throw new Error("Invalid feedback structure from OpenAI");
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Evaluation error:", error);
    
    let errorMessage = "An error occurred during evaluation";
    let userMessage = "평가 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    let statusCode = 500;

    if (error && typeof error === 'object' && 'status' in error && 'code' in error) {
      const apiError = error as any;
      statusCode = apiError.status || 500;
      errorMessage = apiError.message;

      if (apiError.code === "invalid_api_key") {
        userMessage = "OpenAI API 키가 올바르지 않습니다. 환경 변수를 확인해주세요.";
      } else if (apiError.code === "rate_limit_exceeded") {
        userMessage = "API 사용 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
      } else if (apiError.code === "insufficient_quota") {
        userMessage = "OpenAI API 사용 한도가 부족합니다. 계정을 확인해주세요.";
      } else if (apiError.status === 500 || apiError.status === 503) {
        userMessage = "OpenAI 서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (apiError.message) {
        userMessage = `OpenAI API 오류: ${apiError.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
      
      if (error.message.includes("API key") || error.message.includes("OPENAI_API_KEY")) {
        userMessage = "OpenAI API 키가 설정되지 않았습니다. 환경 변수에 OPENAI_API_KEY를 설정해주세요.";
      } else if (error.message.includes("model") || error.message.includes("invalid")) {
        userMessage = "모델 호출 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message.includes("rate limit") || error.message.includes("quota")) {
        userMessage = "API 사용 한도를 초과했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        userMessage = "네트워크 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.";
      } else {
        userMessage = `알 수 없는 오류가 발생했습니다: ${error.message}`;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        message: userMessage,
        details: process.env.NODE_ENV === "development"
          ? {
              errorType: error instanceof Error ? error.name : typeof error,
              errorMessage: error instanceof Error ? error.message : String(error),
            }
          : undefined,
      },
      { status: statusCode }
    );
  }
}
