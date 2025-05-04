import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "outline" | "ghost" | "success" | "warning";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
}

const baseStyles =
  "rounded-xl font-medium transition-all duration-200 focus:outline-none active:scale-95";

const variantStyles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border border-transparent",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-transparent",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-transparent",
  success: "bg-green-600 text-white hover:bg-green-700 border border-transparent",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600 border border-transparent",
  outline: "bg-transparent text-gray-700 border border-gray-500 hover:bg-gray-100",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
