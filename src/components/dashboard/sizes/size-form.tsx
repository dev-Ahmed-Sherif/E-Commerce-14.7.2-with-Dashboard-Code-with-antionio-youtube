"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Size } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash } from "lucide-react";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import AlertModal from "@/components/dashboard/modals/alert-modal";

import { useToast } from "@/hooks/use-toast";

import useToggleState from "@/hooks/use-toggle-state";

import { sizeSchema } from "@/schemas";

type SizeFormProps = {
  initialData: Size | null;
};

// TODO: Set Schema and Form Types in Schemas Folder
type SizeFormValues = z.infer<typeof sizeSchema>;

const SizeForm = ({ initialData }: SizeFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, toggleOpen] = useToggleState(false);
  const [loading, toggleLoading] = useToggleState(false);

  const title = initialData ? "Edit Size" : "Create Size";
  const description = initialData ? "Edit a Size" : "Add New Size";
  const toastMessage = initialData ? "Size Updated" : "Create Size";
  const action = initialData ? "Save changes" : "Create Size";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(sizeSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormValues) => {
    // console.log(data);
    try {
      toggleLoading();
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data);
      }
      router.refresh();
      setTimeout(() => {
        router.push(`/${params.storeId}/sizes`);
      }, 1000);
      toast({
        description: `🎉 ${toastMessage}`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      toggleLoading();
    }
  };

  const onDelete = async () => {
    try {
      toggleLoading();
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      setTimeout(() => {
        router.push(`/${params.storeId}/sizes`);
      }, 1000);
      toast({
        description: "👍👍 Size deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          "Make sure removed all products using this billboard first!",
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
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => {
              toggleOpen();
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      type="text"
                      placeholder="Size Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      type="text"
                      placeholder="Size Value"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto">
            {loading && <Loader2 className="h-6 w-6" />}
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SizeForm;
