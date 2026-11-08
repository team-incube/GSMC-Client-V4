export const scoreKeys = {
  all: ["scores"] as const,
  pending: (filter: { grade: number | null; classNumber: number | null }) =>
    [...scoreKeys.all, "pending", filter] as const,
};
