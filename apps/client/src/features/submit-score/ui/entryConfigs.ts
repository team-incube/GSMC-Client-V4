import type { MultiEntryConfig } from "./MultiEntryForm";

export const AWARD_CONFIG: MultiEntryConfig = {
  categoryType: "AWARD",
  title: "수상경력",
  successMessage: "수상경력을 제출했습니다.",
  countUnit: "개",
  sectionLabel: "수상 추가",
  nameLabel: "대회명 및 수상 내역",
  namePlaceholder: "대회명 및 수상 내역 (예: 전국 해커톤 대회 최우수상)",
  dateLabel: "수상 날짜",
  filePlaceholder: "수상 확인서 첨부",
  withAwardType: true,
  showEntryPoints: false,
};

export const EXTERNAL_ACTIVITY_CONFIG: MultiEntryConfig = {
  categoryType: "EXTERNAL_ACTIVITY",
  title: "외부활동",
  successMessage: "외부활동을 제출했습니다.",
  countUnit: "건",
  sectionLabel: "활동 추가",
  nameLabel: "대회 및 외부활동명",
  namePlaceholder: "대회 및 외부활동명",
  dateLabel: "활동 날짜",
  filePlaceholder: "공문 등 증빙서류 첨부",
  withAwardType: false,
  showEntryPoints: true,
};
