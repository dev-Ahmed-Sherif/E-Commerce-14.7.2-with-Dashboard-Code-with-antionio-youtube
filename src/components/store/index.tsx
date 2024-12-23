"use client";

import Image from "next/image";
import { Tab } from "@headlessui/react";

import GalleryTab from "@/components/store/gallery-tab";

import { Image as ImageType } from "@/types";

type GalleryProps = {
  images: ImageType[];
};

const Gallery = ({ images }: GalleryProps) => {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="mx-auto mt-6 hidden w-full max-w-2xl lg:max-w-none sm:block">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <GalleryTab key={image.id} image={image} />
          ))}
        </Tab.List>
      </div>
      <Tab.Panels className="aspect-square w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <div className="aspect-square relative h-full w-full overflow-hidden sm:rounded-lg">
              <Image
                src={image.url}
                alt="Image"
                fill
                className="object-cover object-center"
              />
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Gallery;
