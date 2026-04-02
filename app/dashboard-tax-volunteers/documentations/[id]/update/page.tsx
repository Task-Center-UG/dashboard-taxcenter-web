import TaxVolunteerDocUpdateForm from "@/components/dashboard-tax-volunteers/tax-volunteer-doc/tax-volunteer-doc-update-form";

interface UpdateTaxVolunteerDocPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateTaxVolunteerDocPage({
  params,
}: UpdateTaxVolunteerDocPageProps) {
  const { id } = await params;

  return <TaxVolunteerDocUpdateForm id={id} />;
}
