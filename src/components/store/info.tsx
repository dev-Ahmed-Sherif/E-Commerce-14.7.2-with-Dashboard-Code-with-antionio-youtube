"use client";

import { MouseEventHandler } from "react";
import { ShoppingCart } from "lucide-react";


import Currency from "@/components/store/currency";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import useCart from "@/hooks/use-cart";

import { Product } from "@/types";

type InfoProps = {
  data: Product;
};

const Info = ({ data }: InfoProps) => {
  const cart = useCart();

  const { name, size, color } = data;

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    // Prevent the parent from being clicked
    event.stopPropagation();

    // Add to cart
    cart.addItem(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl text-gray-900">
          <Currency value={data.price} />
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black"> Size: {size.name} </h3>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black"> Color: {color.name} </h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: color.value }}
          ></div>
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <Button onClick={onAddToCart} className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart />
        </Button>
      </div>
    </div>
  );
};

export default Info;
