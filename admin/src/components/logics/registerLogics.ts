import React, { useState } from "react";
import { Credentials, useRegisterData } from "../providers/RegisterProvider";
import axios from "axios";

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

export function useRegisterFormLogics() {
  const { isValidkey, credentials, setCredentials } = useRegisterData();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      const { data } = await axios.post("/api/register", credentials);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isValidkey, credentials, credentialsChangeHandler, submitRegister, isLoading };
}
