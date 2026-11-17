import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useMyCertificationQuery } from "@/entities/certification";
import { CategoryRow } from "./CategoryRow";
import { SectionCard, SectionMessage } from "./SectionCard";

export function CategorySection() {
  const { data, isPending, isError, refetch } = useMyCertificationQuery();
  const router = useRouter();
  const pathname = usePathname();
  // 알림에서 넘어오면 ?score=<scoreId>로 그 점수가 속한 카테고리를 연다.
  const focusScoreId = useSearchParams().get("score");
  const focusCode =
    focusScoreId != null
      ? data?.categories.find((category) =>
          category.submissions.some((submission) => submission.id === focusScoreId),
        )?.code
      : undefined;

  // 처리한 뒤에는 쿼리를 지워 같은 알림을 다시 눌러도 동작하게 한다.
  useEffect(() => {
    if (focusScoreId != null && data) router.replace(pathname, { scroll: false });
  }, [focusScoreId, data, router, pathname]);

  return (
    <SectionCard
      title="인증 카테고리"
      action={
        data && (
          <span className="text-[12px] leading-[18px] text-soft">
            {data.totalScore} / {data.maxScore}
          </span>
        )
      }
    >
      {isPending ? (
        <ul aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index} className="border-b border-line px-4 py-3.5 last:border-b-0 sm:px-6">
              <div className="h-7 animate-pulse rounded bg-wash" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <SectionMessage message="인증 카테고리를 불러오지 못했습니다." onRetry={() => refetch()} />
      ) : (
        <ul>
          {data.categories.map((category) => (
            <CategoryRow key={category.code} category={category} focused={category.code === focusCode} />
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
