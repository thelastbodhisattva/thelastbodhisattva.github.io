import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                glass: "glass glass-hover text-white/70 hover:text-white",
                ghost: "text-white/50 hover:text-white hover:bg-white/5",
                outline:
                    "border border-white/10 text-white/50 hover:border-white/20 hover:text-white",
                link: "text-white/40 hover:text-white underline-offset-4 hover:underline",
            },
            size: {
                sm: "h-9 px-4 text-xs",
                md: "h-11 px-6 text-sm",
                lg: "h-12 px-8 text-sm",
            },
        },
        defaultVariants: {
            variant: "glass",
            size: "md",
        },
    }
);

interface ButtonProps
    extends ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    )
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
