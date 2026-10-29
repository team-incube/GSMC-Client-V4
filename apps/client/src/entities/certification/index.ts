export { useMyCertificationQuery, certificationKeys } from "./model/queries";
export { addScoreOnly, addScoreWithFile, patchMyScore } from "./api/certification";
export type { ScoreCategoryType } from "./api/types";
export { SUBMISSION_STATUS_LABEL } from "./model/status";
export { AWARD_COMPETITION_TYPES, AWARD_COMPETITION_TYPE_LABEL } from "./model/competitionType";
export type {
  AwardCompetitionType,
  CertificationCategory,
  CertificationCategoryCode,
  CertificationSubmission,
  MyCertification,
  SubmissionStatus,
} from "./model/types";
