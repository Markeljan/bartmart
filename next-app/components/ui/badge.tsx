import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-none border-4 border-foreground px-2 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-4 aria-invalid:ring-destructive aria-invalid:border-destructive overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] [a&]:cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-foreground [a&]:hover:bg-primary [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:transition-all",
        secondary:
          "bg-secondary text-secondary-foreground border-foreground [a&]:hover:bg-secondary [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:transition-all",
        destructive:
          "bg-destructive text-white border-foreground [a&]:hover:bg-destructive focus-visible:ring-destructive focus-visible:border-destructive [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:transition-all",
        outline:
          "text-foreground border-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] [a&]:hover:translate-x-[1px] [a&]:hover:translate-y-[1px] [a&]:transition-all",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
