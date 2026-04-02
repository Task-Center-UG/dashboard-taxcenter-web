import GalleryUpdateForm from "@/components/dashboard/gallery/gallery-update-form";

interface UpdateGalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateGalleryPage({ params }: UpdateGalleryPageProps) {
  const { id } = await params;

  return <GalleryUpdateForm id={id} />;
}
