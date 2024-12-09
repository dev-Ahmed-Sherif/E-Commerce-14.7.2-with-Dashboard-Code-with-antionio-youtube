"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Store } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Trash } from "lucide-react";

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import ApiAlert from "@/components/ui/api-alert";

import useOrigin from "@/hooks/use-origin";

import useToggleState from "@/hooks/use-toggle-state";

import { AddStoreSchema } from "@/schemas";

type SettingsFormProps = {
  initialData: Store;
};

// TODO: Set Schema and Form Types in Schemas Folder
type SettingsFormValues = z.infer<typeof AddStoreSchema>;

const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, toggleOpen] = useToggleState(false);
  const [loading, toggleLoading] = useToggleState(false);

  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(AddStoreSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    // console.log(data);
    try {
      toggleLoading();
      await axios.patch(`/api/stores/${params.storeId}`, data);
      router.refresh();
      toast({
        description: "🎉 Store settings updated successfully",
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
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast({
        description: "👍👍 Store deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Make sure removed all products and categories first!",
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
        <Heading title="Settings" description="Manage store preferences" />
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      type="text"
                      placeholder="Store Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto">
            Save Changes
            {loading && <span className="ml-2 text-gray-500">Loading...</span>}
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
