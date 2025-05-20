import React, { useState } from "react";
import { Credentials, useRegisterData } from "../providers/RegisterProvider";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export function useKeyInputLogics() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    setKey,
    key,
    setIsValidKey,
    isValidkey,
    setRole,
    role,
    isTouchedKey,
    setIsTouchedKey,
    setCredentials,
  } = useRegisterData();

  const keyChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setKey(value);
  };

  const keySubmitHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/token", { key });
      const isSuccess = data.success as boolean;
      const role = data.role as string;

      setIsValidKey(isSuccess);

      if (isSuccess) {
        toast("Token valid! Silahkan lanjutkan pendaftaran", {
          type: "success",
        });
        setCredentials((prev) => ({ ...prev, key, role }));
      } else {
        toast("Token tidak valid! Silahkan coba lagi", { type: "error" });
      }

      setRole(role);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsTouchedKey(true);
    }
  };

  return {
    key,
    keyChangeHandler,
    isLoading,
    keySubmitHandler,
    isValidkey,
    isTouchedKey,
    role,
  };
}

type ErrorRegister = Record<keyof Credentials, string>;
type ErrorValidation = Record<keyof Credentials, string[]>;

export function useRegisterFormLogics() {
  const { isValidkey, credentials, setCredentials } = useRegisterData();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ErrorRegister>({} as ErrorRegister);

  const credentialsChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Credentials
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const submitRegister = async () => {
    try {
      setIsLoading(true);
      setErrors({} as ErrorRegister);
      const { data } = await axios.post("/api/register", credentials);

      toast(data.message, { type: "success" });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        const message: string = data.message;
        const vError: ErrorValidation = data.errors;

        Object.keys(vError).forEach((key) => {
          const oKey = key as keyof Credentials;
          setErrors((prev) => ({ ...prev, [oKey]: vError[oKey][0] }));
        });
        console.error(errors);

        toast(message, { type: "error" });
        return;
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isValidkey,
    credentials,
    credentialsChangeHandler,
    submitRegister,
    isLoading,
    errors,
  };
}
