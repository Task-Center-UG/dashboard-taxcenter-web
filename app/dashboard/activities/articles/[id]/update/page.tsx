import ArticleUpdateForm from "@/components/dashboard/article/article-update-form";

const ArticleUpdatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <div>
      <ArticleUpdateForm id={id} />
    </div>
  );
};

export default ArticleUpdatePage;
