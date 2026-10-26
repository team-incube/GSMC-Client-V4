import Link from "next/link";
import { FileTextIcon } from "@repo/ui";
import { PROJECT_STATUS_LABEL, type Project } from "@/entities/project";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { id, title, status } = project;

  return (
    <li>
      <Link
        href={`/projects/${id}`}
        className="group block overflow-hidden rounded-lg border border-line transition-colors duration-200 hover:border-brand focus-visible:border-brand"
      >
        <div className="flex aspect-video items-center justify-center bg-wash">
          <FileTextIcon aria-hidden="true" className="size-4.5 text-faint" />
        </div>
        <div className="p-2.5">
          <p className="truncate pb-1 text-[14px] leading-4.5 font-medium tracking-[-0.28px] text-strong transition-colors duration-200 group-hover:text-brand group-focus-visible:text-brand">{title}</p>
          {status && (
            <p className={`pt-1 text-[12px] leading-4 ${status === "APPROVED" ? "text-brand" : "text-faint"}`}>
              {PROJECT_STATUS_LABEL[status]}
            </p>
          )}
        </div>
      </Link>
    </li>
  );
}
