import { ProjectWritePage } from "@/views/project-write";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectWritePage projectId={id} />;
}
