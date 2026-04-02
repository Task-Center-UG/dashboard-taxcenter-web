import ActivityDivisionCreateForm from "@/components/dashboard/division-activities/activity-division-create-form";

interface CreateActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateActivityPage({
  params,
}: CreateActivityPageProps) {
  const { id } = await params;

  return (
    <div>
      <ActivityDivisionCreateForm divisionId={id} />
    </div>
  );
}
