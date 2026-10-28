import { useQuery } from "@tanstack/react-query";
import { fetchMyMember, fetchMyScores, fetchMyScoresByCategory, fetchMyTotalScore } from "../api/certification";
import { toMyCertification } from "../lib/toMyCertification";

export const certificationKeys = {
  all: ["certification"] as const,
  mine: () => [...certificationKeys.all, "me"] as const,
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
