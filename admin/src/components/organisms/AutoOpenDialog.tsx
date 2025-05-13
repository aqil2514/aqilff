import React from "react";
import { Button } from "../atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../molecules/dialog";

interface AutoOpenDialogProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

export default function AutoOpenDialog({
  children,
  description,
  title,
}: AutoOpenDialogProps) {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Kode Undangan</Button>
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
