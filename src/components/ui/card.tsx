import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════
   Card Variants
   ═══════════════════════════════════════════ */

const cardVariants = cva("flex flex-col transition-all duration-400", {
    variants: {
        variant: {
            glass: "glass-card",
            panel: "glass-panel",
            subtle: "glass",
        },
    },
    defaultVariants: {
        variant: "glass",
    },
});

/* ═══════════════════════════════════════════
   Card
   ═══════════════════════════════════════════ */

interface CardProps
    extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof cardVariants> { }

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant }), className)}
            {...props}
        />
    )
);
Card.displayName = "Card";

/* ═══════════════════════════════════════════
   Card Sub-components
   ═══════════════════════════════════════════ */

const CardHeader = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("mb-4", className)} {...props} />
    )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn("flex-1", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "mt-6 pt-4 border-t border-white/5 flex items-center",
                className
            )}
            {...props}
        />
    )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter, cardVariants };
export type { CardProps };
