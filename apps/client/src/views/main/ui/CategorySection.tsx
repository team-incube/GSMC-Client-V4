import { useMyCertificationQuery } from "@/entities/certification";
import { CategoryRow } from "./CategoryRow";
import { SectionCard, SectionMessage } from "./SectionCard";

export function CategorySection() {
  const { data, isPending, isError, refetch } = useMyCertificationQuery();

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
            <CategoryRow key={category.code} category={category} />
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
