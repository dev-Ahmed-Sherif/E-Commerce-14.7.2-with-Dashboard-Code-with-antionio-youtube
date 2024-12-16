"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import Modal from "@/components/ui/model";
import { Button } from "@/components/ui/button";

import useToggleState from "@/hooks/use-toggle-state";

type AlertModalProps = {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const AlertModal = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}: AlertModalProps) => {
  const [isMounted, toggleMounted] = useToggleState();

  // console.log(isMounted)

  useEffect(() => {
    toggleMounted();
  }, []);

  if (isMounted) {
    return null;
  }
  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading && <Loader2 className="h-6 w-6" />}
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
