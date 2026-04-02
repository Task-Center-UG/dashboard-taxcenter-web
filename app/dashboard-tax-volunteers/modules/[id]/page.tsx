import TaxModuleDetail from "@/components/dashboard-tax-volunteers/tax-modules/tax-module-detail";
interface DetailTaxModulePageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailTaxModulePage({
  params,
}: DetailTaxModulePageProps) {
  const { id } = await params;

  return <TaxModuleDetail params={{ id: id }} />;
}
