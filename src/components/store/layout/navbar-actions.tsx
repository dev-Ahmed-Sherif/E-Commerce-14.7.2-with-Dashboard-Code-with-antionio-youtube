"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";

import useToggleState from "@/hooks/use-toggle-state";
import { useEffect } from "react";

import useCart from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

import ModeToggle from "@/components/mode-toggle";

const NavbarActions = () => {
  // const [isMounted, toggleIsMounted] = useToggleState();

  // useEffect(() => {
  //   toggleIsMounted();
  // }, []);

  // if (!isMounted) return null;

  const cart = useCart();

  const router = useRouter();

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <ModeToggle />
      <Button
        onClick={() => router.push("/store/cart")}
        className="flex items-center rounded-full bg-black px-4 py-2"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm text-white font-medium">
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default NavbarActions;
