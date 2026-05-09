import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const GradientButton = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: "sm" | "md" | "lg" }>(
  ({ className, size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium text-white",
        "gradient-bg shadow-glow transition-all duration-300",
        "hover:scale-[1.03] hover:shadow-[0_15px_50px_-10px_var(--brand)] active:scale-[0.98]",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-2.5 text-sm",
        size === "lg" && "px-8 py-3.5 text-base",
        className,
      )}
      {...props}
    />
  ),
);
GradientButton.displayName = "GradientButton";
