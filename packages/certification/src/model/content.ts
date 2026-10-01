import heroImage from "../assets/certification.png";
import type { IconName } from "../ui/icons";

export const INTRO_CARDS = [
  {
    title: "역량인증 기준 설정",
    description:
      "GSM 인증제는 영마이스터로서 졸업할 때까지 적정 수준에 도달할 수 있도록 학교 실정에 맞게 역량인증의 기준을 설정하여 운영됩니다.",
  },
  {
    title: "동기 부여 및 책무성 제고",
    description:
      "일정 수준에 도달한 학생에게 인증서를 수여함으로써 학생들의 교육 참여 동기를 부여하고 학교 교육의 책무성을 제고하고자 하는 프로그램입니다.",
  },
] as const;

export const INTRO_TAGS = ["#역량인증", "#전인적 평가", "#동기부여", "#책무성 제고"] as const;

export const AREAS: { icon: IconName; title: string; description: string }[] = [
  { icon: "book", title: "전공 영역", description: "전공 분야의 전문성과 기술 역량을 평가합니다" },
  { icon: "users", title: "인문·인성 영역", description: "인문학적 소양과 바른 인성을 평가합니다" },
  { icon: "languages", title: "외국어 영역", description: "글로벌 시대에 필요한 외국어 능력을 평가합니다" },
];

export const METHODS: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "file",
    title: "포트폴리오 기반",
    description: "학생 개인별 활동을 기반으로 GSMC 시스템과 연계하여 운영됩니다.",
  },
  {
    icon: "trophy",
    title: "학년 단위 평가 및 시상",
    description: "역량인증 내용을 성실하게 관리한 학생을 평가하여 시상합니다.",
  },
  {
    icon: "heart",
    title: "자발적 참여 동기 부여",
    description: "학생들의 자발적 참여와 동기부여를 통해 교육의 질을 향상시킵니다",
  },
];

export const SCORE_ITEMS: {
  icon: IconName;
  title: string;
  description: string;
  maxScore: number;
}[] = [
  { icon: "book", title: "독서활동", description: "빛고을독서마라톤 코스별 1점", maxScore: 7 },
  { icon: "heart", title: "봉사활동", description: "봉사 시간 1시간당 1점", maxScore: 10 },
  { icon: "file", title: "직업기초능력평가", description: "평균 등급 반올림", maxScore: 5 },
  { icon: "award", title: "자격증", description: "자격증 취득 1개당 2점", maxScore: 14 },
  { icon: "code", title: "TOPCIT", description: "취득점수 100점당 1점 반올림", maxScore: 10 },
  { icon: "globe", title: "공인점수", description: "TOEIC, JPT(JLPT) 100점당 1점", maxScore: 10 },
  { icon: "trophy", title: "수상경력", description: "교내외 대회 및 공모전 수상 입상 1개당 1점", maxScore: 10 },
  { icon: "monitor", title: "뉴로우스쿨", description: "회고온도 20점당 1점", maxScore: 5 },
  { icon: "cap", title: "교과성적", description: "학기별 성적 자동 반영", maxScore: 9 },
  { icon: "laptop", title: "프로젝트 참여", description: "프로젝트 참여 활동 1회당 2점", maxScore: 10 },
  { icon: "users", title: "외부활동", description: "대회 및 외부활동 참가 1회당 1점", maxScore: 10 },
];

export const PROCESS_STEPS = [
  { title: "인증제 수여", description: "일정 수준에 도달한 학생에게 공식 인증서를 수여합니다" },
  { title: "학년별 시상", description: "성실하게 관리한 학생을 학년 단위로 평가하여 시상합니다" },
  { title: "포트폴리오 구축", description: "학생 개인별 활동을 기반으로 GSMC 시스템과 연계하여 운영됩니다." },
  { title: "진로 역량 강화", description: "전공, 인성, 외국어 능력을 고루 갖춘 인재로 성장합니다" },
] as const;

/** 실제 FAQ API 연동 전까지 쓰는 임시 데이터 */
export const FAQ_PREVIEW = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  category: "인증제 관련",
  question: "자주 묻는 질문이 무엇인가요?",
  answer:
    "답변을 해주세요. 안녕하세요. 답변을 해주세요. 안녕하세요. 답변을 해주세요. 안녕하세요. 답변을 해주세요. 안녕하세요. 답변을 해주세요. 안녕하세요. 답변을 해주세요.",
}));

export const HERO_IMAGE = heroImage.src;