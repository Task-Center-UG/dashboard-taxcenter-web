import MsmeProductPhotoUpdateForm from "@/components/dashboard/msme-product-photo/msme-product-photo-update-form";

interface UpdateMsmeProductPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateMsmeProductPhotoPage({ params }: UpdateMsmeProductPhotoPageProps) {
  const { id } = await params;

  return <MsmeProductPhotoUpdateForm id={id} />;
}
