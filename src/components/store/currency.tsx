// prenvent hydration warning
"use client";

import { useEffect } from "react";

import useToggleState from "@/hooks/use-toggle-state";

import { currencyFormatter } from "@/lib/utils";

type CurrencyProps = {
  value?: string | number;
};

const Currency = ({ value }: CurrencyProps) => {
  const [isMounted, toggleIsMounted] = useToggleState(false);

  useEffect(() => {
    toggleIsMounted();
  }, []);

  if (!isMounted) return null;

  return (
    <div className="font-semibold">
      {currencyFormatter.format(Number(value))}
    </div>
  );
};

export default Currency;
