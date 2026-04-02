import TaxVolunteerActivityUpdateForm from "@/components/dashboard/tax-volunteer-activity/tax-volunteer-activity-update-form";

interface UpdateTaxVolunteerActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateTaxVolunteerActivityPage({ params }: UpdateTaxVolunteerActivityPageProps) {
  const { id } = await params;

  return <TaxVolunteerActivityUpdateForm id={id} />;
}
