import { cn } from "@/lib/utils";
import React from "react";

interface MainWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export default function MainWrapper({
  children,
  className,
  ...props
}: MainWrapperProps) {
  return (
    <div
      className={cn(
        "w-full min-h-screen bg-slate-100 px-8 py-20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
