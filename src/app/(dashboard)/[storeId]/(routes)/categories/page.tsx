import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import Client from "@/components/dashboard/categories/client";
import { CategoryColumn } from "@/components/dashboard/categories/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy hh:mm:ss"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <Client data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
