import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        {
          "bg-blue-500 hover:bg-blue-600 text-white": variant === "primary",
          "bg-[#1a1a1a] hover:bg-[#262626] text-gray-300 border border-[#262626]":
            variant === "secondary",
          "hover:bg-[#1a1a1a] text-gray-400 hover:text-white":
            variant === "ghost",
          "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20":
            variant === "danger",
        },
        {
          "text-xs px-3 py-1.5": size === "sm",
          "text-sm px-4 py-2.5": size === "md",
          "text-base px-6 py-3": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
