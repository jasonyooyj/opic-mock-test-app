import { TestResult } from "@/types";

const STORAGE_KEY = "opic_test_results";

// Helper to convert blob to base64
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = base64String.split(",")[1] || base64String;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper to convert base64 to blob
export function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export async function saveTestResult(result: TestResult): Promise<void> {
  if (typeof window === "undefined") return;
  
  // Convert any remaining blobs to base64 before saving
  const processedResult = { ...result };
  for (const answer of processedResult.answers) {
    // If there's an audioBlob property (from old format), convert it
    if ((answer as any).audioBlob && !answer.audioData) {
      const blob = (answer as any).audioBlob as Blob;
      answer.audioData = await blobToBase64(blob);
      answer.audioMimeType = blob.type;
      delete (answer as any).audioBlob;
    }
  }
  
  const results = getAllTestResults();
  results.push(processedResult);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function getAllTestResults(): TestResult[] {
  if (typeof window === "undefined") return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as TestResult[];
  } catch {
    return [];
  }
}

export function getTestResultById(id: string): TestResult | undefined {
  const results = getAllTestResults();
  return results.find((r) => r.id === id);
}

export function deleteTestResult(id: string): void {
  if (typeof window === "undefined") return;
  
  const results = getAllTestResults();
  const filtered = results.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearAllTestResults(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

