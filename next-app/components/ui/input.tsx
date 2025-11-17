import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-9 w-full min-w-0 rounded-none border-4 border-foreground bg-transparent px-3 py-1 font-bold text-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none transition-all duration-75 selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-bold file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:translate-x-[-2px] focus-visible:translate-y-[-2px] focus-visible:border-ring focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input",
        "aria-invalid:border-destructive aria-invalid:ring-destructive",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
