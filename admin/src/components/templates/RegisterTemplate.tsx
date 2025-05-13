"use client";
import React from "react";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import MainWrapper from "../atoms/main-wrapper";
import AutoOpenDialog from "../organisms/AutoOpenDialog";
import RegisterProvider from "../providers/RegisterProvider";
import { useKeyInputLogics } from "../logics/registerLogics";
import { DialogClose, DialogFooter } from "../molecules/dialog";

export default function RegisterTemplate() {
  return (
    <RegisterProvider>
      <MainWrapper>
        <KeyInput />
      </MainWrapper>
    </RegisterProvider>
  );
}

const KeyInput = () => {
  const {
    key,
    keyChangeHandler,
    keySubmitHandler,
    isLoading,
    isValidkey,
    role,
  } = useKeyInputLogics();

  return (
    <AutoOpenDialog
      title="Kode Undangan"
      description="Masukkan kode undangan yang didapat dari pihak terkait"
    >
      <div>
        <Label className="mb-2">Kode Undangan</Label>
        <Input
          type="text"
          placeholder="Masukkan kode undangan...."
          value={key}
          disabled={isLoading}
          onChange={keyChangeHandler}
        />
        {!isValidkey && !isLoading && (
          <p className="text-red-500">Kunci tidak diterima...</p>
        )}
        {isValidkey && !isLoading && (
          <p className="text-green-500">
            Kunci Valid. Anda akan mendaftar sebagai {role}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button
          className="cursor-pointer"
          disabled={isLoading}
          onClick={keySubmitHandler}
        >
          {isLoading ? "Mengirim Kode..." : "Masukkan Kode"}
        </Button>
        {isValidkey && (
          <DialogClose className="px-4 py-1 rounded-md text-white cursor-pointer bg-green-600 hover:bg-green-700 duration-200">
            Lanjut Daftar
          </DialogClose>
        )}
      </DialogFooter>
    </AutoOpenDialog>
  );
};
