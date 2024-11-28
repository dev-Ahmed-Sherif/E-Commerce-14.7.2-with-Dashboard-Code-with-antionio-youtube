"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  disabled?: boolean;
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
};

const ImageUpload = ({
  disabled,
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    // onChange(result.info.secure_url);
    onChange(result.info.secure_url);
  };

  if (!isMounted) return null;

  console.log(value);

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
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
      </div>
    </div>
  );
};

export default ImageUpload;
