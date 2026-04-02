import ActivityDivisionDataTable from "@/components/dashboard/division-activities/activity-division-datatable";

interface DivisionActivitiesPageProps {
  params: Promise<{ id: string }>;
}

export default async function DivisionActivitiesPage({
  params,
}: DivisionActivitiesPageProps) {
  const { id } = await params;

  return (
    <div className="flex-1 space-y-4">
      <ActivityDivisionDataTable divisionId={id} />
    </div>
  );
}
