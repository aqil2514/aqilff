import clsx from "clsx";
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
      className={clsx(
        "w-full h-screen bg-slate-100 flex flex-col items-center justify-center gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
