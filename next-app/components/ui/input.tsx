import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input h-9 w-full min-w-0 rounded-none border-4 border-foreground bg-transparent px-3 py-1 text-base font-bold outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-4 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:translate-x-[-2px] focus-visible:translate-y-[-2px] transition-all duration-75",
        "aria-invalid:ring-destructive aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
