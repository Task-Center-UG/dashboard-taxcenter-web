import TrainingUpdateForm from "@/components/dashboard/training/training-update-form";

interface UpdateTrainingPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateTrainingPage({ params }: UpdateTrainingPageProps) {
  const { id } = await params;

  return <TrainingUpdateForm id={id} />;
}
