import clsx from "clsx";
import React from "react";

type BgVariant = "none" | "gradientRedToOrange";

interface MainWrapperProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  background?: BgVariant;
}

const bgVariant: Record<BgVariant, string> = {
  gradientRedToOrange: "bg-gradient-to-b from-red-900 to-orange-400",
  none: "bg-transparent",
};

export default function MainWrapper({
  children,
  className = "p-4",
  background = "none",
  ...props
}: MainWrapperProps) {
  return (
    <div {...props} className={clsx(className, bgVariant[background])}>
      {children}
    </div>
  );
}
