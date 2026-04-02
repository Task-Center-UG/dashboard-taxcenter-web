import ActivityDivisionUpdateForm from "@/components/dashboard/division-activities/activity-division-update-form";

interface UpdateActivityPageProps {
  params: Promise<{ id: string; activityId: string }>;
}

export default async function UpdateActivityPage({
  params,
}: UpdateActivityPageProps) {
  const { id, activityId } = await params;

  return (
    <ActivityDivisionUpdateForm id={activityId} divisionId={id} />
  );
}
