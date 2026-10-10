export const FAQ_CATEGORIES = ["인증제 관련", "프로젝트 제출", "점수 관련", "계정 관련"] as const;

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type Faq = {
  id: number;
  category: FaqCategory;
  question: string;
  answer: string;
};

const PLACEHOLDER_QUESTION = "자주 묻는 질문이 무엇인가요?";
const PLACEHOLDER_ANSWER = PLACEHOLDER_QUESTION.repeat(7);

const CATEGORY_COUNTS: [FaqCategory, number][] = [
  ["인증제 관련", 4],
  ["프로젝트 제출", 4],
  ["점수 관련", 6],
];

export const FAQS: Faq[] = CATEGORY_COUNTS.flatMap(([category, count]) =>
  Array.from({ length: count }, () => category),
).map((category, index) => ({
  id: index + 1,
  category,
  question: PLACEHOLDER_QUESTION,
  answer: PLACEHOLDER_ANSWER,
}));
