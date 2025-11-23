// HACKERS OPIc 주제 카테고리 정의
export interface TopicCategory {
  id: string;
  name: string;
  nameKo: string;
  description?: string;
  pdfFileName?: string;
  audioFileName?: string;
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: "school",
    name: "School & Classes",
    nameKo: "학교, 수업",
    pdfFileName: "1강_학교, 수업_unlocked-ocr.pdf",
    audioFileName: "1강_학교, 수업.mp3",
  },
  {
    id: "work",
    name: "Work & Office",
    nameKo: "직장, 업무",
    pdfFileName: "2강_직장, 업무_unlocked-ocr.pdf",
    audioFileName: "2강_직장, 업무.mp3",
  },
  {
    id: "living",
    name: "Living Place",
    nameKo: "사는 곳",
    pdfFileName: "3강_사는 곳_unlocked-ocr.pdf",
    audioFileName: "3강_사는 곳.mp3",
  },
  {
    id: "neighborhood",
    name: "Neighborhood",
    nameKo: "동네 및 이웃",
    pdfFileName: "4강_동네 및 이웃_unlocked-ocr.pdf",
    audioFileName: "4강_동네 및 이웃.mp3",
  },
  {
    id: "movies",
    name: "Watching Movies",
    nameKo: "영화 관람",
    pdfFileName: "5강_영화 관람_unlocked-ocr.pdf",
    audioFileName: "5강_영화 관람.mp3",
  },
  {
    id: "park",
    name: "Going to Park",
    nameKo: "공원가기",
    pdfFileName: "6강_공원가기_unlocked-ocr.pdf",
    audioFileName: "6강_공원가기.mp3",
  },
  {
    id: "beach",
    name: "Beach & Camping",
    nameKo: "해변, 캠핑 가기",
    pdfFileName: "7강_해변, 캠핑 가기_unlocked-ocr.pdf",
    audioFileName: "7강_해변, 캠핑 가기.mp3",
  },
  {
    id: "sports-watching",
    name: "Watching Sports",
    nameKo: "스포츠 관람",
    pdfFileName: "8강_스포츠 관람_unlocked-ocr.pdf",
    audioFileName: "8강_스포츠 관람.mp3",
  },
  {
    id: "shopping",
    name: "Shopping",
    nameKo: "쇼핑하기",
    pdfFileName: "9강_쇼핑하기_unlocked-ocr.pdf",
    audioFileName: "9강_쇼핑하기.mp3",
  },
  {
    id: "tv",
    name: "TV & Reality Shows",
    nameKo: "TV, 리얼리티 쇼 시청하기",
    pdfFileName: "10강_TV, 리얼리티 쇼 시청하기_unlocked-ocr.pdf",
    audioFileName: "10강_TV, 리얼리티 쇼 시청하기.mp3",
  },
  {
    id: "cafe",
    name: "Cafe & Coffee Shop",
    nameKo: "카페, 커피전문점에 가기",
    pdfFileName: "11강_카페, 커피전문점에 가기_unlocked-ocr.pdf",
    audioFileName: "11강_카페, 커피전문점에 가기.mp3",
  },
  {
    id: "sns",
    name: "Posting on SNS",
    nameKo: "SNS에 글 올리기",
    pdfFileName: "12강_SNS에 글 올리기_unlocked-ocr.pdf",
    audioFileName: "12강_SNS에 글 올리기.mp3",
  },
  {
    id: "music",
    name: "Listening to Music",
    nameKo: "음악 감상하기",
    pdfFileName: "13강_음악 감상하기_unlocked-ocr.pdf",
    audioFileName: "13강_음악 감상하기.mp3",
  },
  {
    id: "instruments",
    name: "Playing Instruments",
    nameKo: "악기 연주하기",
    pdfFileName: "14강_악기 연주하기_unlocked-ocr.pdf",
    audioFileName: "14강_악기 연주하기.mp3",
  },
  {
    id: "cooking",
    name: "Cooking",
    nameKo: "요리하기",
    pdfFileName: "15강_요리하기_unlocked-ocr.pdf",
    audioFileName: "15강_요리하기.mp3",
  },
  {
    id: "reading",
    name: "Reading",
    nameKo: "독서",
    pdfFileName: "16강_독서_unlocked-ocr.pdf",
    audioFileName: "16강_독서.mp3",
  },
  {
    id: "sports-playing",
    name: "Playing Sports (Basketball, Baseball, Soccer)",
    nameKo: "농구, 야구, 축구",
    pdfFileName: "17강_농구, 야구, 축구_unlocked-ocr.pdf",
    audioFileName: "17강_농구, 야구, 축구.mp3",
  },
  {
    id: "yoga-fitness",
    name: "Yoga & Fitness",
    nameKo: "요가, 헬스",
    pdfFileName: "18강_요가, 헬스_unlocked-ocr.pdf",
    audioFileName: "18강_요가, 헬스.mp3",
  },
  {
    id: "swimming",
    name: "Swimming",
    nameKo: "수영",
    pdfFileName: "19강_수영_unlocked-ocr.pdf",
    audioFileName: "19강_수영.mp3",
  },
  {
    id: "biking",
    name: "Biking",
    nameKo: "자전거",
    pdfFileName: "20강_자전거_unlocked-ocr.pdf",
    audioFileName: "20강_자전거.mp3",
  },
  {
    id: "travel",
    name: "Domestic & International Travel",
    nameKo: "국내, 해외 여행",
    pdfFileName: "21강_국내, 해외 여행_unlocked-ocr.pdf",
    audioFileName: "21강_국내, 해외 여행.mp3",
  },
  {
    id: "business-trip",
    name: "Business Trip",
    nameKo: "국내, 해외 출장",
    pdfFileName: "22강_국내, 해외 출장_unlocked-ocr.pdf",
    audioFileName: "22강_국내, 해외 출장.mp3",
  },
  {
    id: "staycation",
    name: "Staycation",
    nameKo: "집에서 보내는 휴가",
    pdfFileName: "23강_집에서 보내는 휴가_unlocked-ocr.pdf",
    audioFileName: "23강_집에서 보내는 휴가.mp3",
  },
  {
    id: "surprise-1",
    name: "Surprise Topics 1",
    nameKo: "돌발주제-집안일, 외식, 인터넷 서핑, 명절",
    pdfFileName: "24강_돌발주제-집안일, 외식, 인터넷 서핑, 명절_unlocked-ocr.pdf",
    audioFileName: "24강_돌발주제-집안일, 외식, 인터넷 서핑, 명절.mp3",
  },
  {
    id: "surprise-2",
    name: "Surprise Topics 2",
    nameKo: "돌발주제-교통수단, 프로젝트, 날씨, 도서관",
    pdfFileName: "25강_돌발주제-교통수단, 프로젝트, 날씨, 도서관_unlocked-ocr.pdf",
    audioFileName: "25강_돌발주제-교통수단, 프로젝트, 날씨, 도서관.mp3",
  },
  {
    id: "surprise-3",
    name: "Surprise Topics 3",
    nameKo: "돌발주제-산업, 가구, 약속, 은행",
    pdfFileName: "26강_돌발주제-산업, 가구, 약속, 은행_unlocked-ocr.pdf",
    audioFileName: "26강_돌발주제-산업, 가구, 약속, 은행.mp3",
  },
  {
    id: "surprise-4",
    name: "Surprise Topics 4",
    nameKo: "돌발주제-지역축제, 지형, 패션, 전화통화",
    pdfFileName: "27강_돌발주제-지역축제, 지형, 패션, 전화통화_unlocked-ocr.pdf",
    audioFileName: "27강_돌발주제-지역축제, 지형, 패션, 전화통화.mp3",
  },
  {
    id: "surprise-5",
    name: "Surprise Topics 5",
    nameKo: "돌발주제-호텔, 기술, 건강, 재활용",
    pdfFileName: "28강_돌발주제-호텔, 기술, 건강, 재활용_unlocked-ocr.pdf",
    audioFileName: "28강_돌발주제-호텔, 기술, 건강, 재활용.mp3",
  },
  {
    id: "roleplay-questions",
    name: "Role-play: Asking Questions",
    nameKo: "롤플레이-질문하기",
    pdfFileName: "29강_롤플레이-질문하기_unlocked-ocr.pdf",
    audioFileName: "29강_롤플레이-질문하기.mp3",
  },
  {
    id: "roleplay-solving",
    name: "Role-play: Problem Solving",
    nameKo: "롤플레이-문제 해결하기",
    pdfFileName: "30강_롤플레이-문제 해결하기_unlocked-ocr.pdf",
    audioFileName: "30강_롤플레이-문제 해결하기.mp3",
  },
  {
    id: "important-types",
    name: "Important Question Types",
    nameKo: "OPIc 중요 유형들 정리",
    pdfFileName: "31강_OPIc 중요 유형들 정리_unlocked-ocr.pdf",
    audioFileName: "31강_OPIc 중요 유형들 정리.mp3",
  },
  {
    id: "common-topics",
    name: "Common Topics Summary",
    nameKo: "OPIc 빈출 주제들 정리",
    pdfFileName: "32강_OPIc 빈출 주제들 정리_unlocked-ocr.pdf",
    audioFileName: "32강_OPIc 빈출 주제들 정리.mp3",
  },
  {
    id: "tips",
    name: "High Score Tips & Emergency Phrases",
    nameKo: "실전 시험 고득점 Tip & 위기탈출 문장 특강",
    pdfFileName: "33강_실전 시험 고득점 Tip & 위기탈출 문장 특강_unlocked-ocr.pdf",
    audioFileName: "33강_실전 시험 고득점 Tip & 위기탈출 문장 특강.mp3",
  },
];

export function getTopicById(id: string): TopicCategory | undefined {
  return TOPIC_CATEGORIES.find((topic) => topic.id === id);
}

export function getTopicByPdfFileName(fileName: string): TopicCategory | undefined {
  return TOPIC_CATEGORIES.find((topic) => topic.pdfFileName === fileName);
}

export function getTopicByAudioFileName(fileName: string): TopicCategory | undefined {
  return TOPIC_CATEGORIES.find((topic) => topic.audioFileName === fileName);
}

export function getAllTopics(): TopicCategory[] {
  return TOPIC_CATEGORIES;
}

export function getTopicsByCategory(category: "main" | "surprise" | "roleplay" | "summary"): TopicCategory[] {
  if (category === "main") {
    return TOPIC_CATEGORIES.filter((t) => !t.id.startsWith("surprise") && !t.id.startsWith("roleplay") && !t.id.includes("types") && !t.id.includes("common") && !t.id.includes("tips"));
  }
  if (category === "surprise") {
    return TOPIC_CATEGORIES.filter((t) => t.id.startsWith("surprise"));
  }
  if (category === "roleplay") {
    return TOPIC_CATEGORIES.filter((t) => t.id.startsWith("roleplay"));
  }
  if (category === "summary") {
    return TOPIC_CATEGORIES.filter((t) => t.id.includes("types") || t.id.includes("common") || t.id.includes("tips"));
  }
  return [];
}


