import UserUpdateForm from "@/components/dashboard/users/user-update-form";

interface UpdateUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateUserPage({ params }: UpdateUserPageProps) {
  const { id } = await params;

  return <UserUpdateForm id={id} />;
}
