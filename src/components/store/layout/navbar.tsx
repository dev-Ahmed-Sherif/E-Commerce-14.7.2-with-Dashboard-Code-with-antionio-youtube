import Link from "next/link";

import getCategories from "@/actions/get-categories";

import Container from "@/components/ui/container";
import MainNav from "@/components/store/layout/main-nav";
import NavbarActions from "./navbar-actions";

// Revalidate the data every 10 minutes which disable caching
export const revalidate = 0;

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <div className="border-b">
      <Container>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/store/home" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-xl"> Store </p>
          </Link>
          <MainNav data={categories} />
          <NavbarActions />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
