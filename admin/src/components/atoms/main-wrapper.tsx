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
        "w-full h-screen bg-slate-100 flex flex-col items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
