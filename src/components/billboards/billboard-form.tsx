"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Trash, Loader2 } from "lucide-react";
import { Billboard } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

import { useToast } from "@/hooks/use-toast";

import { UploadButton } from "@/utils/uploadthing";

import { AddBillboardSchema } from "@/schemas";
import useToggleState from "@/hooks/use-toggle-state";

type BillboardFormProps = {
  initialData: Billboard | null;
};

// TODO: Set Schema and Form Types in Schemas Folder
type BillboardFormValues = z.infer<typeof AddBillboardSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();

  const [open, toggleOpen] = useToggleState(false);
  const [loading, toggleLoading] = useToggleState(false);

  const [image, setImage] = useState<string | undefined>(initialData?.imageUrl);

  // console.log(image);

  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const description = initialData ? "Edit a Billboard" : "Add New Billboard";
  const toastMessage = initialData ? "Billboard Updated" : "Create Billboard";
  const action = initialData ? "Save changes" : "Create Billboard";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(AddBillboardSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: "",
    },
  });

  // Detect Image Selections
  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("imageUrl", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      toggleLoading();
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data);
      }
      router.refresh();

      setTimeout(() => {
        router.push(`/${params.storeId}/billboards`);
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
      // Get the Billboard to delete its Image first from uploadthing
      const billboard = await axios.get(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      // console.log(billboard)
      const imageUrl = billboard.data.imageUrl;
      HandleImageDelete(imageUrl, true);
      await axios.delete(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      router.refresh();
      setTimeout(() => {
        router.push(`/${params.storeId}/billboards`);
      }, 1000);
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
      toggleOpen();
    }
  };

  const HandleImageDelete = (image: string, itemDelete?: boolean) => {
    // Delete the image from your server or cloud storage
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((response) => {
        if (response.data.success) {
          setImage("");
          if (!itemDelete) {
            toast({
              description: "🎉 Image deleted successfully",
            });
          }
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel> Upload Image *</FormLabel>
                <FormDescription>
                  Choose an Image that will show-case your Store nicely
                </FormDescription>
                <FormControl>
                  {image ? (
                    <ImageUpload
                      value={[image]}
                      onRemove={() => HandleImageDelete(image)}
                    />
                  ) : (
                    <div
                      className="flex flex-col items-center max-w-[400px] p-12 border-2 
                       border-dashed border-primary/50 mt-4"
                    >
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          // Do something with the response
                          console.log("Files: ", res);
                          setImage(res[0].url);
                          toast({
                            description: "🎉 Upload Completed",
                          });
                        }}
                        onUploadError={(error: Error) => {
                          // Do something with the error.
                          toast({
                            variant: "destructive",
                            description: `ERROR! ${error.message}`,
                          });
                        }}
                      />
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={loading}
                      type="text"
                      placeholder="Billboard label"
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

export default BillboardForm;
