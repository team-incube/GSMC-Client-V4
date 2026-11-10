import { formatStudentNumber, type ProjectParticipant } from "@/entities/project";

type ParticipantListProps = {
  participants: ProjectParticipant[];
};

// TODO: 서버가 참여자 역할을 주면 디자인의 PM 배지를 이름 오른쪽에 붙인다.
export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6">
      <h2 className="text-[11px] leading-[16.5px] font-medium tracking-[0.88px] text-soft uppercase">
        참여 인원 · {participants.length}명
      </h2>
      <ul className="flex flex-col gap-3 pt-4">
        {participants.map(({ id, name, studentNumber }) => (
          <li key={id}>
            <p className="text-[13px] leading-[13px] font-medium text-strong">{name}</p>
            {studentNumber && (
              <p className="pt-0.5 text-[11px] leading-[16.5px] text-faint">{formatStudentNumber(studentNumber)}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
