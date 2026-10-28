import { graphqlRequest } from "@repo/lib";
import type {
  AddScoreWithFileResponse,
  MyMemberResponse,
  MyScoresResponse,
  MyTotalScoreResponse,
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

export async function fetchMyTotalScore() {
  const { myTotalScore } = await graphqlRequest<MyTotalScoreResponse>(MY_TOTAL_SCORE, { includeApprovedOnly: true });
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
};

export async function addScoreWithFile({ categoryType, value, fileId }: AddScoreWithFileParams) {
  const { addScoreWithFile } = await graphqlRequest<AddScoreWithFileResponse>(ADD_SCORE_WITH_FILE, {
    categoryType,
    input: { value, fileId },
  });
  return addScoreWithFile.scoreId;
}
