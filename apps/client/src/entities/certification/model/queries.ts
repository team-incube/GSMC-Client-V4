import { useQuery } from "@tanstack/react-query";
import { fetchMyName, fetchMyScores, fetchMyScoresByCategory, fetchMyTotalScore } from "../api/certification";
import { toMyCertification } from "../lib/toMyCertification";

export const certificationKeys = {
  all: ["certification"] as const,
  mine: () => [...certificationKeys.all, "me"] as const,
};

async function fetchMyCertification() {
  const [studentName, scoresByCategory, scores, totalScore] = await Promise.all([
    fetchMyName(),
    fetchMyScoresByCategory(),
    fetchMyScores(),
    fetchMyTotalScore(),
  ]);
  return toMyCertification({ studentName, totalScore, scoresByCategory, scores });
}

export function useMyCertificationQuery() {
  return useQuery({
    queryKey: certificationKeys.mine(),
    queryFn: fetchMyCertification,
  });
}
