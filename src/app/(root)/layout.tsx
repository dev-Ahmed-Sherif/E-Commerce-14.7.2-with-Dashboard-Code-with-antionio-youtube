import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type SetupLayoutProps = {
  children: React.ReactNode;
};

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const store = await prismadb.store.findFirst({
    where: { userId: userId },
  });

  if (store) redirect(`/${store.id}`);
  return <>{children}</>;
}
