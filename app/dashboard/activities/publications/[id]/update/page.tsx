import PublicationUpdateForm from "@/components/dashboard/publication/publication-update-form";

const PublicationUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <PublicationUpdateForm id={id} />
    </div>
  );
};

export default PublicationUpdatePage;
