import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sports" | "parties" | "default";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-blue-500/10 text-blue-400 border border-blue-500/20":
            variant === "sports",
          "bg-purple-500/10 text-purple-400 border border-purple-500/20":
            variant === "parties",
          "bg-[#1a1a1a] text-gray-400 border border-[#262626]":
            variant === "default",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
