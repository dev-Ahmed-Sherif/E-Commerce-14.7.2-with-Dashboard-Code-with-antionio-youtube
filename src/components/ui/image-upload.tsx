"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash } from "lucide-react";

// import { UploadButton } from "@/utils/uploadthing";

// import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import useToggleState from "@/hooks/use-toggle-state";

type ImageUploadProps = {
  value: any[] | undefined;
  onRemove: (value: string) => void;
};

const ImageUpload = ({
  value,
  onRemove,
}: ImageUploadProps) => {
  const [imageIsDeleting, toggleImageIsDeleting] = useToggleState(false);

  const [selected, setSelected] = useState<any>("");

  const onImageRemove = (value: string) => {
    toggleImageIsDeleting();
    onRemove(value);
    setSelected(value);
  };

  // console.log(value);

  return (
    <div className="mb-4 relative flex items-center gap-4">
      {value?.map((item) => (
        <div
          key={item}
          className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4"
        >
          <Image
            fill
            className="object-contain"
            src={item.url ? item.url : item}
            alt="Image"
          />
          <Button
            onClick={() => onImageRemove(item.url ? item.url : item)}
            type="button"
            size="icon"
            variant="destructive"
            className="absolute right-[-12px] top-0"
          >
            {imageIsDeleting && selected === (item.url ? item.url : item) ? (
              <Loader2 />
            ) : (
              <Trash />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;
