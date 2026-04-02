import MsmeAssistanceUpdateForm from "@/components/dashboard/msme-assistance/msme-assistance-update-form";

interface UpdateMsmeAssistancePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateMsmeAssistancePage({
  params,
}: UpdateMsmeAssistancePageProps) {
  const { id } = await params;

  return <MsmeAssistanceUpdateForm id={id} />;
}
