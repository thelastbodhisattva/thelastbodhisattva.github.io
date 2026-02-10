import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-white/5 text-white/50 border border-white/5",
                featured:
                    "bg-white/10 text-white/80",
                archived:
                    "bg-white/5 text-white/40",
                category:
                    "tag uppercase",
            },
            size: {
                sm: "text-[10px] px-2 py-0.5",
                md: "text-xs",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
        },
    }
);

interface BadgeProps
    extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> { }

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant, size, ...props }, ref) => (
        <span
            ref={ref}
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
export type { BadgeProps };
