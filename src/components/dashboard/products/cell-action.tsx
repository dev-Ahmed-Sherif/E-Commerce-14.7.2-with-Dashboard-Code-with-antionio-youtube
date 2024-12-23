"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { ProductColumn } from "@/components/dashboard/products/columns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import AlertModal from "@/components/dashboard/modals/alert-modal";

import useToggleState from "@/hooks/use-toggle-state";

type CellActionProps = {
  data: ProductColumn;
};

const CellAction = ({ data }: CellActionProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const [loading, toggleLoading] = useToggleState(false);
  const [open, toggleOpen] = useToggleState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied!",
      description: "Product Id copied to your clipboard.",
    });
  };

  const onDelete = async () => {
    try {
      toggleLoading();
      const product = await axios.get(
        `/api/${params.storeId}/products/${data.id}`
      );
      const productImages = product.data.images;
      for (let i = 0; i < productImages.length; i++) {
        HandleImageDelete(productImages[i]);
      }
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);
      router.refresh();
      setTimeout(() => {
        router.push(`/${params.storeId}/products`);
      }, 1000);
      toast({
        description: "👍👍 Product deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          "Make sure removed all categories using this Product first!",
      });
    } finally {
      toggleLoading();
      toggleOpen();
    }
  };

  const HandleImageDelete = (image: any) => {
    // console.log(image);
    // Delete the image from your server or cloud storage
    const imageKey = image.url.substring(image.url.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((response) => {
        if (response.data.success) {
          // toast({
          //   description: "🎉 Image deleted successfully",
          // });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => toggleOpen()}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleOpen()}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
