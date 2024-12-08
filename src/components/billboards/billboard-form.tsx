"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Billboard } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash } from "lucide-react";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { AddBillboardSchema } from "@/schemas";

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
import ApiAlert from "@/components/ui/api-alert";
import ImageUpload from "@/components/ui/ImageUpload";

import useOrigin from "@/hooks/use-origin";

type BillboardFormProps = {
  initialData: Billboard | null;
};

// TODO: Set Schema and Form Types in Schemas Folder
type BillboardFormValues = z.infer<typeof AddBillboardSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageIsDeleting, setImageIsDeleting] = useState<boolean>(false);
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

  // console.log(image);

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
    // console.log(data);
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // Get the Billboard to delete its Image first from uploadthing
      const billboard = await axios.get(
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      console.log(billboard)
      const imageUrl = billboard.data.imageUrl;
      HandleImageDelete(imageUrl);
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
      setLoading(false);
      setOpen(false);
    }
  };

  const HandleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    // Delete the image from your server or cloud storage
    const imageKey = image.substring(image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((response) => {
        if (response.data.success) {
          setImage("");
          toast({
            description: "🎉 Image deleted successfully",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      })
      .finally(() => {
        // After deleting, set the image state to undefined and set the imageIsDeleting to false
        setImageIsDeleting(false);
      });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
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
              setOpen(true);
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
          {/* <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : undefined}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
                    // <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                    //   <Image
                    //     fill
                    //     className="object-contain"
                    //     src={image}
                    //     alt="Image"
                    //   />
                    //   <Button
                    //     onClick={() => HandleImageDelete(image)}
                    //     type="button"
                    //     size="icon"
                    //     variant="destructive"
                    //     className="absolute right-[-12px] top-0"
                    //   >
                    //     {imageIsDeleting ? <Loader2 /> : <Trash />}
                    //   </Button>
                    // </div>
                    <ImageUpload
                      value={[image]}
                      deleted={imageIsDeleting}
                      onChange={(url) => field.onChange(url)}
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
            {action}
            {loading && <span className="ml-2 text-gray-500">Loading...</span>}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
