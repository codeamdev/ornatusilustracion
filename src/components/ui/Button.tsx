import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:
    "bg-gallery-accent text-white hover:bg-gallery-accent/85 border border-gallery-accent",
  secondary:
    "bg-transparent text-gallery-black border border-gallery-black hover:bg-gallery-black hover:text-white",
  danger:
    "bg-transparent text-red-600 border border-red-300 hover:bg-red-600 hover:text-white",
  ghost:
    "bg-transparent text-gallery-gray hover:text-gallery-black border border-transparent",
};

const sizes = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2.5 text-xs",
  lg: "px-8 py-3 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 tracking-[0.15em] uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
