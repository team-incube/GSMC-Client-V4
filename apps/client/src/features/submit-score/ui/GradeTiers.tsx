type GradeTiersProps = {
  maxScore: number;
  activeGrade: number | null;
  scoreOf: (grade: number) => number;
};

export function GradeTiers({ maxScore, activeGrade, scoreOf }: GradeTiersProps) {
  const grades = Array.from({ length: maxScore }, (_, index) => index + 1);

  return (
    <ol aria-label="등급별 점수" className="grid grid-cols-5 gap-1">
      {grades.map((grade) => {
        const active = grade === activeGrade;
        return (
          <li
            key={grade}
            aria-current={active || undefined}
            className={`flex flex-col items-center rounded-md py-2 transition-colors duration-200 ${
              active ? "bg-brand text-white" : "bg-wash text-soft"
            }`}
          >
            <span className="text-[11px] leading-[16.5px] font-medium tracking-[0.08em]">{grade}등급</span>
            <span className="pt-0.5 text-[12px] leading-[18px] font-semibold">{scoreOf(grade)}점</span>
          </li>
        );
      })}
    </ol>
  );
}
