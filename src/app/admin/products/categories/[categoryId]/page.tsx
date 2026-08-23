import { notFound } from "next/navigation";
import { initialCategories } from "../_components/categories-data";
import { CategoryDetails } from "../_components/category-details";

export default async function CategoryDetailsPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const isRootCategory = initialCategories.some(
    (category) => category.id === categoryId && category.parentId === null,
  );

  if (!isRootCategory) notFound();

  return <CategoryDetails categoryId={categoryId} />;
}
