import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

const knownColors: Record<string, string> = {
  sports:  "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  parties: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

const palette = [
  "bg-green-500/10 text-green-400 border border-green-500/20",
  "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  "bg-teal-500/10 text-teal-400 border border-teal-500/20",
  "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  "bg-red-500/10 text-red-400 border border-red-500/20",
];

function variantClass(variant?: string): string {
  if (!variant) return "bg-[#1a1a1a] text-gray-400 border border-[#262626]";
  if (knownColors[variant]) return knownColors[variant];
  const hash = variant.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

export default function Badge({ children, variant, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        variantClass(variant),
        className
      )}
    >
      {children}
    </span>
  );
}
