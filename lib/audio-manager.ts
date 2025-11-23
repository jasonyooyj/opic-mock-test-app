import { getTopicByAudioFileName, getAllTopics } from "./topic-categories";

/**
 * 오디오 파일 경로 생성
 */
export function getAudioPath(audioFileName: string): string {
  return `/audio/hackers/${audioFileName}`;
}

/**
 * 주제 ID로 오디오 경로 가져오기
 */
export function getAudioPathByTopicId(topicId: string): string | undefined {
  const topic = getAllTopics().find((t) => t.id === topicId);
  if (topic?.audioFileName) {
    return getAudioPath(topic.audioFileName);
  }
  return undefined;
}

/**
 * 오디오 파일명으로 경로 가져오기
 */
export function getAudioPathByFileName(fileName: string): string | undefined {
  const topic = getTopicByAudioFileName(fileName);
  if (topic?.audioFileName) {
    return getAudioPath(topic.audioFileName);
  }
  return undefined;
}

/**
 * 모든 오디오 파일 경로 목록
 */
export function getAllAudioPaths(): Array<{ topicId: string; path: string; name: string }> {
  return getAllTopics()
    .filter((topic) => topic.audioFileName)
    .map((topic) => ({
      topicId: topic.id,
      path: getAudioPath(topic.audioFileName!),
      name: topic.nameKo,
    }));
}

/**
 * 오디오 파일이 존재하는지 확인 (클라이언트 사이드)
 */
export async function checkAudioExists(audioPath: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  
  try {
    const response = await fetch(audioPath, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}


