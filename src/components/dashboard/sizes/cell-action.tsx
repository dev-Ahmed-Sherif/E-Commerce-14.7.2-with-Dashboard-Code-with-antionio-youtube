"use client";

import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";

import { SizeColumn } from "@/components/dashboard/sizes/columns";

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
  data: SizeColumn;
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
      description: "Billboard Id copied to your clipboard.",
    });
  };

  const onDelete = async () => {
    try {
      toggleLoading();
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
      router.refresh();
      toast({
        description: "👍👍 Size deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          "Make sure removed all categories using this billboard first!",
      });
    } finally {
      toggleLoading();
      toggleOpen();
    }
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
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
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
