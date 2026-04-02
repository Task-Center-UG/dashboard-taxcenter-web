import AgendaSliderUpdateForm from "@/components/dashboard/agenda-slider/agenda-slider-update-form";

const AgendaSliderUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <AgendaSliderUpdateForm id={id} />
    </div>
  );
};

export default AgendaSliderUpdatePage;
