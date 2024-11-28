import { format } from "date-fns";
import prismadb from "@/lib/prismadb";

import Client from "@/components/billboards/client";
import { BillboardColumn } from "@/components/billboards/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy hh:mm:ss"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <Client data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
