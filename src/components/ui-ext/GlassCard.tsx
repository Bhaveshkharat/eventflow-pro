"use client";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

export function GlassCard({ className, children, hover = true, ...props }: HTMLMotionProps<"div"> & { hover?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn("glass rounded-2xl shadow-elegant relative overflow-hidden", hover && "hover-lift", className)}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      <div className="relative z-10">
        {children as any}
      </div>
    </motion.div>
  );
}
