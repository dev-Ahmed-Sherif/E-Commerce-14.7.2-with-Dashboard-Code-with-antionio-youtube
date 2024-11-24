import { redirect } from "next/navigation";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

import StoreSwitcher from "@/components/StoreSwitcher";
import MainNav from "@/components/Layout/MainNav";

const Navbar = async () => {
  //   const { isSignedIn, user } = useUser();
  const { userId } = await auth();

  //   if (!isSignedIn) {
  //     redirect("/sign-in");
  //   }
  if (!userId) {
    redirect("/sign-in");
  }

  //   const stores =  () => {
  //     const storesDB =  prismadb.store.findMany({
  //       where: {
  //         userId: user.id,
  //       },
  //     });
  //     return storesDB;
  //   };

  const stores = await prismadb.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />{" "}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
