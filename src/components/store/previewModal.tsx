"use client";

import StoreModal from "./storeModal";
import Gallery from ".";
import Info from "./info";

import usePreviewModal from "@/hooks/use-preview-modal";

const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const product = usePreviewModal((state) => state.data);

  if (!product) return null;

  return (
    <StoreModal isOpen={previewModal.isOpen} onClose={previewModal.onClose}>
      <div className="w-full grid items-start grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="sm:col-span-4 lg:col-span-5">
          <Gallery images={product.images} />
        </div>
        <div className="sm:col-span-8 lg:col-span-7">
          {/* Product Info */}
          <Info data={product} />
        </div>
      </div>
    </StoreModal>
  );
};

export default PreviewModal;
