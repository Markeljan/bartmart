import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-none border-4 border-foreground px-2 py-0.5 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring aria-invalid:border-destructive aria-invalid:ring-destructive [&>svg]:pointer-events-none [&>svg]:size-3 [a&]:cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-primary text-primary-foreground [a&]:transition-all [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:hover:bg-primary [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
        secondary:
          "border-foreground bg-secondary text-secondary-foreground [a&]:transition-all [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:hover:bg-secondary [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
        destructive:
          "border-foreground bg-destructive text-white focus-visible:border-destructive focus-visible:ring-destructive [a&]:transition-all [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:hover:bg-destructive [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
        outline:
          "border-foreground text-foreground [a&]:transition-all [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return <Comp className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />;
}

export { Badge, badgeVariants };
