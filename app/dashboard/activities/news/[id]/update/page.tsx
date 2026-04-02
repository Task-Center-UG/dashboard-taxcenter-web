import NewsUpdateForm from "@/components/dashboard/news/news-update-form";

const NewsUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <NewsUpdateForm id={id} />
    </div>
  );
};

export default NewsUpdatePage;
