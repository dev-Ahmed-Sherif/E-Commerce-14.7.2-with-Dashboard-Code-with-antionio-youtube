import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { currencyFormatter } from "@/lib/utils";

import Client from "@/components/dashboard/orders/client";
import { OrderColumn } from "@/components/dashboard/orders/columns";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: currencyFormatter.format(
      item.orderItems.reduce(
        (total, item) => total + Number(item.product.price),
        0
      )
    ),

    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy hh:mm:ss"),
    updatedAt: format(item.updatedAt, "MMMM do, yyyy hh:mm:ss"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 pt-6 p-8">
        <Client data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
