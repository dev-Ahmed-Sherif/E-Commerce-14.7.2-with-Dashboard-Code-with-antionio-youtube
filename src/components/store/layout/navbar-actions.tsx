"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

import useToggleState from "@/hooks/use-toggle-state";
import { useEffect } from "react";

const NavbarActions = () => {
  // const [isMounted, toggleIsMounted] = useToggleState();

  // useEffect(() => {
  //   toggleIsMounted();
  // }, []);

  // if (!isMounted) return null;

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <Button className="flex items-center rounded-full bg-black px-4 py-2">
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm text-white font-medium">0</span>
      </Button>
    </div>
  );
};

export default NavbarActions;
