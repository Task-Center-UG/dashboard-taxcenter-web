import TaxMaterialUpdateForm from "@/components/dashboard/tax-material/tax-material-update-form";

const TaxMaterialUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <TaxMaterialUpdateForm id={id} />
    </div>
  );
};

export default TaxMaterialUpdatePage;
