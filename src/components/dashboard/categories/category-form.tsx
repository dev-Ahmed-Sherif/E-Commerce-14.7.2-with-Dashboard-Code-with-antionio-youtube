"use client";

import { useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Billboard, Category } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash } from "lucide-react";
import { AddCategorySchema } from "@/schemas";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AlertModal from "@/components/dashboard/modals/alert-modal";

import useToggleState from "@/hooks/use-toggle-state";

type CategoryFormProps = {
  initialData: Category | null;
  billboards: Billboard[];
};

// TODO: Set Schema and Form Types in Schemas Folder
type CategoryFormValues = z.infer<typeof AddCategorySchema>;

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, toggleOpen] = useToggleState(false);
  const [loading, toggleLoading] = useToggleState(false);

  const title = initialData ? "Edit Category" : "Create Category";
  const description = initialData ? "Edit a Category" : "Add New Category";
  const toastMessage = initialData ? "Category Updated" : "Create Category";
  const action = initialData ? "Save changes" : "Create Category";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(AddCategorySchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    // console.log(data);
    try {
      toggleLoading();
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();

      setTimeout(() => {
        router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      router.refresh();
      setTimeout(() => {
        router.push(`/${params.storeId}/categories`);
      }, 1000);
      toast({
        description: "👍👍 Category deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description:
          "Make sure removed all products using this Category first!",
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
                  <FormLabel> Category Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      type="text"
                      placeholder="Category Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm;
