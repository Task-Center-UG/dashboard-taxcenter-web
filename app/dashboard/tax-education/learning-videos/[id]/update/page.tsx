import TaxLearningVideoUpdateForm from "@/components/dashboard/tax-learning-video/tax-learning-video-update-form";

const LearningVideoUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <TaxLearningVideoUpdateForm id={id} />
    </div>
  );
};

export default LearningVideoUpdatePage;
