export const FAQ_CATEGORIES = ["기본 안내", "누적 점수", "당해 연도 점수", "GSMC 이용", "운영 기간"] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type Faq = {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
};

// 노션 GSMC 문서의 FAQ 기준.
const FAQ_ITEMS: Omit<Faq, "id">[] = [
  {
    category: "기본 안내",
    question: "GSM역량인증제란 무엇인가요?",
    answer: "학생의 전공 역량과 학교생활 활동을 기준에 따라 점수로 관리하는 제도입니다.",
  },
  {
    category: "기본 안내",
    question: "GSMC는 무엇인가요?",
    answer: "역량인증 활동과 증빙자료를 등록하고 심사 상태와 점수를 확인하는 서비스입니다.",
  },
  {
    category: "기본 안내",
    question: "총점은 어떻게 구성되나요?",
    answer: "총 100점으로, 누적 점수 34점과 당해 연도 점수 66점으로 구성됩니다.",
  },
  {
    category: "기본 안내",
    question: "자료를 제출하면 점수가 바로 확정되나요?",
    answer: "아닙니다. 담당 교사의 확인과 승인 후 실제로 점수가 부여됩니다.",
  },
  {
    category: "기본 안내",
    question: "예상 점수와 확정 점수는 왜 다른가요?",
    answer: "증빙자료, 인정 기간, 중복 여부, 항목별 최대 점수를 심사하면서 조정될 수 있습니다.",
  },
  {
    category: "기본 안내",
    question: "어떤 증빙자료가 필요한가요?",
    answer:
      "자격증, 성적표, 수료증, 상장, 봉사확인서처럼 활동 내용과 본인 참여를 확인할 수 있는 공식 자료가 필요합니다.",
  },
  {
    category: "누적 점수",
    question: "어떤 자격증이 인정되나요?",
    answer: "전공 관련 자격증과 한국사·국어·한자 3급 이상 자격이 대상입니다. 1개당 2점, 최대 14점입니다.",
  },
  {
    category: "누적 점수",
    question: "입학 전에 취득한 자격증도 인정되나요?",
    answer: "고등학교 재학 중 취득한 자격증만 인정됩니다.",
  },
  {
    category: "누적 점수",
    question: "TOEIC·JPT·JLPT는 어떻게 반영되나요?",
    answer: "TOEIC과 JPT는 100점당 1점, 최대 10점이며 JLPT는 TOEIC 점수로 환산합니다.",
  },
  {
    category: "누적 점수",
    question: "외국어 시험 성적을 여러 번 제출할 수 있나요?",
    answer:
      "여러 번 제출할 수 있으며 동일 시험에서는 높은 점수를 인정합니다. 서로 다른 시험 간 합산 여부는 확인이 필요합니다.",
  },
  {
    category: "누적 점수",
    question: "1학년 모의 TOEIC도 인정되나요?",
    answer: "학교에서 실시한 1학년 모의 TOEIC은 인정됩니다.",
  },
  {
    category: "누적 점수",
    question: "TOEIC 사관 학교도 점수가 있나요?",
    answer: "해당 연도 출석률이 70% 이상이면 1점이 부여되며 다음 연도로 누적되지 않습니다.",
  },
  {
    category: "당해 연도 점수",
    question: "독서 활동은 어떻게 반영되나요?",
    answer: "빛고을 독서마라톤 단계당 1점, 최대 7점입니다.",
  },
  {
    category: "당해 연도 점수",
    question: "봉사활동은 어떻게 반영되나요?",
    answer: "교육과정 외 1365 봉사활동을 기준으로 1시간당 1점, 최대 10점입니다.",
  },
  {
    category: "당해 연도 점수",
    question: "직업기초능력 점수는 어떻게 반영되나요?",
    answer: "평균 등급을 기준으로 반영하며 최대 5점입니다.",
  },
  {
    category: "당해 연도 점수",
    question: "교내 수상은 모두 인정되나요?",
    answer: "운영계획에 지정된 교내 대회·행사·인성 관련 수상만 인정되며 1건당 1점, 최대 10점입니다.",
  },
  {
    category: "당해 연도 점수",
    question: "뉴로우스쿨 활동은 어떻게 반영되나요?",
    answer: "회고 온도 20도당 1점, 최대 5점입니다.",
  },
  {
    category: "당해 연도 점수",
    question: "프로젝트 활동은 어떻게 반영되나요?",
    answer: "2명 이상이 참여한 프로젝트를 대상으로 1건당 2점, 최대 10점입니다.",
  },
  {
    category: "당해 연도 점수",
    question: "팀 프로젝트는 누가 제출하나요?",
    answer: "팀장이 DataGSM에 참여 인원, 프로젝트 설명, 기술 스택 등을 대표로 등록합니다. GSMC는 해당 정보를 가져와 참여자의 ‘내 프로젝트’에 표시합니다.",
  },
  {
    category: "당해 연도 점수",
    question: "개인 프로젝트도 인정되나요?",
    answer: "공식 기준상 프로젝트 항목은 2명 이상이 참여한 프로젝트만 인정됩니다.",
  },
  {
    category: "당해 연도 점수",
    question: "교외 활동은 어떻게 반영되나요?",
    answer: "공식 증빙자료가 있는 활동을 대상으로 1건당 1점, 최대 10점입니다.",
  },
  {
    category: "GSMC 이용",
    question: "활동은 어떻게 등록하나요?",
    answer:
      "활동 항목을 선택하고 내용과 증빙자료를 입력한 뒤 제출합니다. 담당 교사 승인 후 실제 점수에 반영됩니다.",
  },
  {
    category: "GSMC 이용",
    question: "제출한 활동을 수정하거나 삭제할 수 있나요?",
    answer: "아직 승인되지 않은 항목은 수정할 수 있습니다.",
  },
  {
    category: "GSMC 이용",
    question: "반려되면 어떻게 해야 하나요?",
    answer: "반려 사유를 확인하고 내용이나 증빙자료를 보완하여 다시 제출합니다.",
  },
  {
    category: "GSMC 이용",
    question: "점수가 예상과 다르면 어떻게 하나요?",
    answer: "항목별 최대 점수, 인정 기간, 중복 여부와 심사 결과를 확인한 뒤 담당 교사에게 문의합니다.",
  },
  {
    category: "GSMC 이용",
    question: "로그인이나 파일 업로드가 되지 않으면 어떻게 하나요?",
    answer: "오류 화면, 발생 시각, 파일 형식과 용량을 기록하여 담당자에게 문의합니다.\ndiscord: e.jxn_2",
  },
  {
    category: "운영 기간",
    question: "2026학년도 활동 인정 기간은 언제인가요?",
    answer:
      "1학년은 2026년 3월 4일부터 12월 31일, 2학년은 2026년 1월 6일부터 12월 31일, 3학년은 2024년 3월 4일부터 2025년 12월 31일까지입니다.",
  },
  {
    category: "운영 기간",
    question: "역량인증 점수는 어디에 활용되나요?",
    answer: "교육활동 지도, 1·2학년 우수학생 시상과 프로그램·기업 선발, 3학년 졸업 표창 등에 활용됩니다.",
  },
];

export const FAQS: Faq[] = FAQ_ITEMS.map((faq, index) => ({ id: index + 1, ...faq }));
