"use client";
import React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import MainWrapper from "../../atoms/main-wrapper";
import AutoOpenDialog from "../../organisms/DialogAutoOpen";
import RegisterProvider from "../../providers/RegisterProvider";
import {
  useKeyInputLogics,
  useRegisterFormLogics,
} from "@/hooks/forms/use-register-form-logics";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useRouter } from "next/navigation";

export default function RegisterTemplate() {
  return (
    <RegisterProvider>
      <MainWrapper className="flex-row">
        <RegisterForm />
        <KeyInput />
        <BackToLogin />
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
    isTouchedKey,
    role,
  } = useKeyInputLogics();

  const isRejected = isTouchedKey && !isValidkey && !isLoading;
  const isAccepted = isValidkey && !isLoading;

  return (
    <AutoOpenDialog
      title="Kode Undangan"
      triggerText="Kode Undangan"
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
        {isRejected && <p className="text-red-500">Kunci tidak diterima...</p>}
        {isAccepted && (
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

const RegisterForm = () => {
  const {
    isValidkey,
    credentials,
    credentialsChangeHandler,
    submitRegister,
    isLoading,
    errors
  } = useRegisterFormLogics();

  const {confirmPassword, email, password, phoneNumber} = errors;

  if (!isValidkey) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Daftar Akun</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Daftar Keanggotaan</DialogTitle>
          <DialogDescription>
            Silahkan lengkapi profil di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="email" className="mb-2">
            Email
          </Label>
          <Input
            disabled={isLoading}
            id="email"
            value={credentials.email}
            onChange={(e) => credentialsChangeHandler(e, "email")}
          />
          {email && <p className="text-red-500">{email}</p>}
        </div>
        <div>
          <Label htmlFor="phone-number" className="mb-2">
            Nomor Telepon
          </Label>
          <Input
            disabled={isLoading}
            id="phone-number"
            value={credentials.phoneNumber}
            onChange={(e) => credentialsChangeHandler(e, "phoneNumber")}
          />
          {phoneNumber && <p className="text-red-500">{phoneNumber}</p>}
        </div>
        <div>
          <Label htmlFor="password" className="mb-2">
            Kata Sandi
          </Label>
          <Input
            disabled={isLoading}
            id="password"
            type="password"
            value={credentials.password}
            onChange={(e) => credentialsChangeHandler(e, "password")}
            />
            {password && <p className="text-red-500">{password}</p>}
        </div>
        <div>
          <Label htmlFor="confirm-password" className="mb-2">
            Konfirmasi Kata Sandi
          </Label>
          <Input
            disabled={isLoading}
            id="confirm-password"
            type="password"
            value={credentials.confirmPassword}
            onChange={(e) => credentialsChangeHandler(e, "confirmPassword")}
          />
            {confirmPassword && <p className="text-red-500">{confirmPassword}</p>}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer"
            onClick={submitRegister}
          >
            {isLoading ? "Mendaftar..." : "Daftar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BackToLogin = () => {
  const router = useRouter();
  return(
    <Button variant={"outline"} onClick={() => router.push("/auth")}>Login</Button>
  )
}