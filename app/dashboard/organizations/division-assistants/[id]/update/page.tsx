import DivisionAssistantUpdateForm from "@/components/dashboard/division-assistants/division-assistant-update-form";

interface UpdateDivisionAssistantPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateDivisionAssistantPage({
  params,
}: UpdateDivisionAssistantPageProps) {
  const { id } = await params;

  return <DivisionAssistantUpdateForm id={id} />;
}
