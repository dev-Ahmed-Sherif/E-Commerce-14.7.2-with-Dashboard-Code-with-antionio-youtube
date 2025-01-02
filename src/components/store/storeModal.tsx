"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import IconButton from "./icon-button";
import { X } from "lucide-react";

type StoreModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const StoreModal = ({ isOpen, onClose, children }: StoreModalProps) => {
  return (
    <Transition show={isOpen} appear as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Make Shadow */}
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="p-4 flex items-center justify-center min-h-full text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl overflow-hidden text-left align-middle rounded-lg">
                <div
                  className="relative w-full flex items-center overflow-hidden bg-white px-4 pb-8 
                pt-14 shadow-2xl sm:px-6 sm:pt-10 md:p-6 lg:p-8"
                >
                  <div className="absolute group top-4 right-4">
                    <IconButton
                      icon={<X className="" size={20} />}
                      onClick={onClose}
                    />
                  </div>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StoreModal;
