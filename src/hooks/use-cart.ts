import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast, useToast } from "@/hooks/use-toast";

import { Product } from "@/types";

type CartStore = {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
};

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        // const {toast} = useToast();

        if (existingItem) {
          return toast({
            description: "Item already exists in cart",
          });
        }

        set({ items: [...get().items, data] });
        toast({
          description: "Item added to cart",
        });
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        toast({
          description: "Item removed from cart",
        });
      },
      removeAll: () => {
        set({ items: [] });
        toast({
          description: "Cart cleared",
        });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
