import TaxClinicServiceUpdateForm from "@/components/dashboard/tax-clinic-services/tax-clinic-service-update-form";

interface UpdateTaxClinicServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateTaxClinicServicePage({ params }: UpdateTaxClinicServicePageProps) {
  const { id } = await params;

  return <TaxClinicServiceUpdateForm id={id} />;
}
