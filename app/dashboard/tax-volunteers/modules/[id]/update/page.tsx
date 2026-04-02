import TaxModuleUpdateForm from "@/components/dashboard/tax-modules/tax-module-update-form";

interface UpdateTaxModulePageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateTaxModulePage({
  params,
}: UpdateTaxModulePageProps) {
  const { id } = await params;

  return <TaxModuleUpdateForm id={id} />;
}
