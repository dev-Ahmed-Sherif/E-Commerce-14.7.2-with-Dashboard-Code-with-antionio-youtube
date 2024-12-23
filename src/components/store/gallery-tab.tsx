"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";

import { Image as ImageType } from "@/types";

import { cn } from "@/lib/utils";

type GalleryTabProps = {
  image: ImageType;
};

const GalleryTab = ({ image }: GalleryTabProps) => {
  return (
    <Tab className="relative aspect-square cursor-pointer flex items-center justify-center rounded-md bg-white">
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            <Image
              src={image.url}
              alt=""
              fill
              // width={selected? 500 : 250}
              // height={selected? 500 : 250}
              className="object-cover object-center"
            />
          </span>
          <span
            className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-black" : "ring-transparent"
            )}
          />
        </div>
      )}
    </Tab>
  );
};

export default GalleryTab;
