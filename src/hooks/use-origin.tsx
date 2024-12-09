import { useEffect } from "react";

import useToggleState from "@/hooks/use-toggle-state";

const useOrigin = () => {
  const [mounted, toggleMounted] = useToggleState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    toggleMounted();
    // cleanup function when component unmounts
    // return () => isMounted(false)
  }, []);

  if (!mounted) return "";

  return origin;
};

export default useOrigin;
