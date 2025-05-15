import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../molecules/dialog";
import { Button } from "../ui/button";

interface AutoOpenDialogProps {
  children: React.ReactNode;
  title: string;
  triggerText:string;
  description: string;
}

export default function AutoOpenDialog({
  children,
  description,
  triggerText,
  title,
}: AutoOpenDialogProps) {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
