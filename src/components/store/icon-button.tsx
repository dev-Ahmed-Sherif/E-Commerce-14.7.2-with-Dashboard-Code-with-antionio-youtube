"use client";

import { MouseEventHandler } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

type IconButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  className?: string;
  icon: React.ReactElement;
};

const IconButton = ({ onClick, className, icon }: IconButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "rounded-full flex justify-center border shadow-md p-2 transition hover:scale-110",
        className
      )}
    >
      {icon}
    </Button>
  );
};

export default IconButton;
