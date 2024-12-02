import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import Client from "@/components/sizes/client";
import { SizeColumn } from "@/components/sizes/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy hh:mm:ss"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <Client data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;