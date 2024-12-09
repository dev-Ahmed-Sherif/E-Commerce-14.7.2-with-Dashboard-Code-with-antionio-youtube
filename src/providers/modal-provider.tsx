"use client";

import { useEffect } from "react";

import StoreModal from "@/components/modals/store-modal";

import useToggleState from "@/hooks/use-toggle-state";

const ModalProvider = () => {
  const [isMounted, toggleIsMounted] = useToggleState(false);

  useEffect(() => {
    toggleIsMounted();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};

export default ModalProvider;
