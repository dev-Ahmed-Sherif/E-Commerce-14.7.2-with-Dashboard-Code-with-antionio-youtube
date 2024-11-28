import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Navbar from "@/components/layout/navbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: {
    storeId: string;
  };
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });

  if (!store) redirect("/");

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
