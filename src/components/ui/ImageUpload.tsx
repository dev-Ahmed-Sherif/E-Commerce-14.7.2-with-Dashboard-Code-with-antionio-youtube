"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";

// import { UploadButton } from "@/utils/uploadthing";

// import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  deleted: boolean;
  value: any[] | undefined;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

const ImageUpload = ({
  deleted,
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  // const [isMounted, setIsMounted] = useState<boolean>(false);
  const [imageIsDeleting, setImageIsDeleting] = useState<boolean>(deleted);
  const [image, setImage] = useState<any[] | undefined>(value);

  // const { toast } = useToast();

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // const onUpload = (result: any) => {

  //   onChange(result.info.secure_url);
  // };

  // if (!isMounted) return null;

  // console.log(value);
  // console.log(image);

  // const HandleImageDelete = (image: string) => {
  //   setImageIsDeleting(true);
  //   // Delete the image from your server or cloud storage
  //   const imageKey = image.substring(image.lastIndexOf("/") + 1);

  //   axios
  //     .post("/api/uploadthing/delete", { imageKey })
  //     .then((response) => {
  //       if (response.data.success) {
  //         setImage([]);
  //         toast({
  //           description: "🎉 Image deleted successfully",
  //         });
  //       }
  //     })
  //     .catch(() => {
  //       toast({
  //         variant: "destructive",
  //         description: "Something went wrong",
  //       });
  //     })
  //     .finally(() => {
  //       // After deleting, set the image state to undefined and set the imageIsDeleting to false
  //       setImageIsDeleting(false);
  //     });
  // };

  return (
    <div className="mb-4 relative flex items-center gap-4">
      {value?.map((item) => (
        <div
          key={item}
          className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4"
        >
          <Image fill className="object-contain" src={item} alt="Image" />
          <Button
            onClick={() => onRemove(item)}
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-[-12px] top-0"
          >
            {imageIsDeleting ? <Loader2 /> : <Trash />}
          </Button>
        </div>
      ))}
      {/* <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default ImageUpload;
