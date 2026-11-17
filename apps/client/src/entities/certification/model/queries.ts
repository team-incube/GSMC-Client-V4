import { useQuery } from "@tanstack/react-query";
import {
  fetchMyMember,
  fetchMyGradeTopPercentile,
  fetchMyScores,
  fetchMyScoresByCategory,
  fetchMyTotalScore,
} from "../api/certification";
import { toMyCertification } from "../lib/toMyCertification";

export const certificationKeys = {
  all: ["certification"] as const,
  mine: () => [...certificationKeys.all, "me"] as const,
  gradePercentile: () => [...certificationKeys.all, "me", "grade-percentile"] as const,
};

async function fetchMyCertification() {
  const [member, scoresByCategory, scores, totalScore, expectedTotalScore] = await Promise.all([
    fetchMyMember(),
    fetchMyScoresByCategory(),
    fetchMyScores(),
    fetchMyTotalScore(true),
    fetchMyTotalScore(false),
  ]);
  return toMyCertification({
    studentName: member.name,
    grade: member.grade,
    totalScore,
    expectedTotalScore,
    scoresByCategory,
    scores,
  });
}

export function useMyCertificationQuery() {
  return useQuery({
    queryKey: certificationKeys.mine(),
    queryFn: fetchMyCertification,
  });
}

// 학년 내 상위 몇 %인지(작을수록 순위가 높다). 총점과 따로 조회해 실패해도 점수 요약은 보여 준다.
export function useMyGradeTopPercentileQuery() {
  return useQuery({
    queryKey: certificationKeys.gradePercentile(),
    queryFn: fetchMyGradeTopPercentile,
  });
}
