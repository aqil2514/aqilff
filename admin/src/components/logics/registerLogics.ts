import { useState } from "react";
import { useRegisterData } from "../providers/RegisterProvider";
import axios from "axios";

export function useKeyInputLogics() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setKey, key, setIsValidKey, isValidkey, setRole, role } = useRegisterData();

  const keyChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.value;

    setKey(value);
  };

  const keySubmitHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/register", { key });
      const isSuccess = data.success as boolean;
      const role = data.role as string;

      setIsValidKey(isSuccess);
      setRole(role)
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { key, keyChangeHandler, isLoading, keySubmitHandler, isValidkey, role };
}
