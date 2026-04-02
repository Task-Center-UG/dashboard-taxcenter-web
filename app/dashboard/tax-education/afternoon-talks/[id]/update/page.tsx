import AfternoonTalkUpdateForm from "@/components/dashboard/afternoon-talk/afternoon-talk-update-form";

const AfternoonTalkUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <AfternoonTalkUpdateForm id={id} />
    </div>
  );
};

export default AfternoonTalkUpdatePage;
