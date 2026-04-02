import SliderUpdateForm from "@/components/dashboard/sliders/slider-update-form";

interface UpdateSliderPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateSliderPage({ params }: UpdateSliderPageProps) {
  const { id } = await params;

  return <SliderUpdateForm id={id} />;
}
