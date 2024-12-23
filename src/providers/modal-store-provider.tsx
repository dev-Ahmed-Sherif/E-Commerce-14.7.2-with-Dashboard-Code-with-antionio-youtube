"use client";

import { useEffect } from "react";

import useToggleState from "@/hooks/use-toggle-state";
import PreviewModal from "@/components/store/previewModal";

const StoreModalProvider = () => {
  const [isMounted, toggleIsMounted] = useToggleState(true);

  useEffect(() => {
    toggleIsMounted();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PreviewModal />
    </>
  );
};

export default StoreModalProvider;
