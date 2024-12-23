"use client";

import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { BillboardColumn } from "@/components/dashboard/billboards/columns";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import AlertModal from "@/components/dashboard/modals/alert-modal";

import { useToast } from "@/hooks/use-toast";
import useToggleState from "@/hooks/use-toggle-state";

type CellActionProps = {
  data: BillboardColumn;
};

const CellAction = ({ data }: CellActionProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();

  const [loading, toggleLoading] = useToggleState(false);
  const [open, toogleOpen] = useToggleState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Copied!",
      description: "Billboard Id copied to your clipboard.",
    });
  };

  const onDelete = async () => {
    // console.log(data);
    try {
      toggleLoading();
      // Get the Billboard to delete its Image first from uploadthing
      const billboard = await axios.get(
        `/api/${params.storeId}/billboards/${data.id}`
      );
      // console.log(billboard);
      const imageUrl = billboard.data.imageUrl;
      HandleImageDelete(imageUrl);
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      router.refresh();
      toast({
        description: "👍👍 Billboard deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          "Make sure removed all categories using this billboard first!",
      });
    } finally {
      toggleLoading();
      toogleOpen();
    }
  };

  const HandleImageDelete = (image: string) => {
    // Delete the image from your server or cloud storage
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

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
          description: "Something went wrong with deleting the image",
        });
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => toogleOpen()}
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
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toogleOpen()}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
