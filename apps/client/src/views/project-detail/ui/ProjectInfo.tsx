import { PROJECT_STATUS_LABEL, PROJECT_STATUS_TEXT_CLASS, type Project } from "@/entities/project";

type ProjectInfoProps = {
  project: Project;
};

export function ProjectInfo({ project }: ProjectInfoProps) {
  const { title, description, status } = project;

  return (
    <section className="rounded-xl border border-line bg-surface p-6">
      <div className="flex items-start justify-between gap-3">
        <h1 className="min-w-0 text-[24px] leading-9 font-semibold tracking-[-0.96px] break-words text-strong">{title}</h1>
        <span
          className={`flex h-6 shrink-0 items-center rounded-full border border-line bg-wash px-[11px] text-[11px] leading-[16.5px] font-medium ${PROJECT_STATUS_TEXT_CLASS[status]}`}
        >
          {PROJECT_STATUS_LABEL[status]}
        </span>
      </div>
      {description && (
        <p className="pt-4 text-[14px] leading-[22.75px] break-words whitespace-pre-line text-body">{description}</p>
      )}
    </section>
  );
}
