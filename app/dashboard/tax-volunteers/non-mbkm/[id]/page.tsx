import NonMbkmRegistrationDetail from "@/components/dashboard/non-mbkm-registration/non-mbkm-registration-detail";

interface NonMbkmDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NonMbkmDetailPage({
  params,
}: NonMbkmDetailPageProps) {
  const { id } = await params;

  return <NonMbkmRegistrationDetail id={id} />;
}
