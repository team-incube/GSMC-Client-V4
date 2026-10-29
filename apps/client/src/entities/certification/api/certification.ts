import { graphqlRequest } from "@repo/lib";
import type { AwardCompetitionType } from "../model/types";
import type {
  AddScoreWithFileResponse,
  MyMemberResponse,
  MyScoresResponse,
  MyTotalScoreResponse,
  PatchMyScoreResponse,
  ScoreCategoryType,
  ScoresByCategoryResponse,
} from "./types";

const MY_SCORES_BY_CATEGORY = `
  query {
    myScoresByCategory {
      categoryType
      categoryEnglishName
      categoryKoreanName
      recognizedScore
      scores { scoreId activityName scoreStatus }
    }
  }
`;

const MY_SCORES = `
  query {
    myScores {
      scoreId
      scoreStatus
      activityName
      scoreValue
      updatedAt
      file { originalName }
      rejectionReason
      activityDate
      competitionType
    }
  }
`;

const MY_TOTAL_SCORE = `
  query($includeApprovedOnly: Boolean) {
    myTotalScore(includeApprovedOnly: $includeApprovedOnly) {
      totalScore
    }
  }
`;

const MY_MEMBER = `
  query {
    myMember {
      name
      grade
    }
  }
`;

export async function fetchMyMember() {
  const { myMember } = await graphqlRequest<MyMemberResponse>(MY_MEMBER);
  return myMember;
}

export async function fetchMyScoresByCategory() {
  const { myScoresByCategory } = await graphqlRequest<ScoresByCategoryResponse>(MY_SCORES_BY_CATEGORY);
  return myScoresByCategory;
}

export async function fetchMyScores() {
  const { myScores } = await graphqlRequest<MyScoresResponse>(MY_SCORES);
  return myScores;
}

// includeApprovedOnly가 false면 반려되지 않은 점수(승인 + 심사중)를 모두 합산한다.
export async function fetchMyTotalScore(includeApprovedOnly: boolean) {
  const { myTotalScore } = await graphqlRequest<MyTotalScoreResponse>(MY_TOTAL_SCORE, { includeApprovedOnly });
  return myTotalScore.totalScore;
}

const ADD_SCORE_WITH_FILE = `
  mutation($categoryType: CategoryType!, $input: ScoreWithValueAndFileInput!) {
    addScoreWithFile(categoryType: $categoryType, input: $input) {
      scoreId
    }
  }
`;

type AddScoreWithFileParams = {
  categoryType: ScoreCategoryType;
  value: string;
  fileId: string;
  // YYYY-MM-DD. 제출 시점 학년의 인정 기간 안이어야 한다.
  activityDate?: string;
  // 수상경력에서만 보낼 수 있다.
  competitionType?: AwardCompetitionType;
};

export async function addScoreWithFile({
  categoryType,
  value,
  fileId,
  activityDate,
  competitionType,
}: AddScoreWithFileParams) {
  const { addScoreWithFile } = await graphqlRequest<AddScoreWithFileResponse>(ADD_SCORE_WITH_FILE, {
    categoryType,
    input: { value, fileId, activityDate, competitionType },
  });
  return addScoreWithFile.scoreId;
}

const PATCH_MY_SCORE = `
  mutation($scoreId: ID!, $input: PatchMyScoreInput!) {
    patchMyScore(scoreId: $scoreId, input: $input) {
      scoreId
    }
  }
`;

// 생략한 필드는 서버에서 기존 값을 그대로 둔다.
type PatchMyScoreParams = {
  scoreId: string;
  value?: string;
  fileId?: string;
  activityDate?: string;
  competitionType?: AwardCompetitionType;
};

// 심사중인 본인 점수만 수정할 수 있다. 심사가 끝난 점수는 서버가 CONFLICT로 거부한다.
export async function patchMyScore({ scoreId, value, fileId, activityDate, competitionType }: PatchMyScoreParams) {
  const { patchMyScore } = await graphqlRequest<PatchMyScoreResponse>(PATCH_MY_SCORE, {
    scoreId,
    input: { value, fileId, activityDate, competitionType },
  });
  return patchMyScore.scoreId;
}
