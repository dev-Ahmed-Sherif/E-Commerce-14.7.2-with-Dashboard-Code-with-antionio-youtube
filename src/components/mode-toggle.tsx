"use client";

import type { FC } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ModeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleCurrentTheme = () => {
    // console.log(resolvedTheme);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ghost"
      onClick={() => toggleCurrentTheme()}
    >
      <Sun className="h-6 w-6 rotate-0 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="absolute h-6 w-6 rotate-0 scale-100 transition-all dark:hidden" />
      {/* used for screen readers Accessibility */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ModeToggle;
