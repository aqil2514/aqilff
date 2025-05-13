import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface RegisterContextState {
  key: string;
  setKey: React.Dispatch<SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<SetStateAction<string>>;
  isValidkey: boolean;
  setIsValidKey: React.Dispatch<SetStateAction<boolean>>;
}

const RegisterContext = createContext<RegisterContextState>(
  {} as RegisterContextState
);

interface RegisterProviderProps {
  children: React.ReactNode;
}

export default function RegisterProvider({ children }: RegisterProviderProps) {
  const [key, setKey] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isValidkey, setIsValidKey] = useState<boolean>(false);

  const value: RegisterContextState = {
    key,
    setKey,
    isValidkey,
    setIsValidKey,
    role,
    setRole
  };
  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
}

export const useRegisterData = () => useContext(RegisterContext);
