import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

export interface Credentials {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

interface RegisterContextState {
  key: string;
  setKey: React.Dispatch<SetStateAction<string>>;
  role: string;
  setRole: React.Dispatch<SetStateAction<string>>;
  isValidkey: boolean;
  setIsValidKey: React.Dispatch<SetStateAction<boolean>>;
  credentials: Credentials;
  setCredentials: React.Dispatch<SetStateAction<Credentials>>;
  isTouchedKey: boolean;
  setIsTouchedKey: React.Dispatch<SetStateAction<boolean>>;
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
  const [credentials, setCredentials] = useState<Credentials>({
    confirmPassword: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [isTouchedKey, setIsTouchedKey] = useState<boolean>(false);

  const value: RegisterContextState = {
    key,
    setKey,
    isValidkey,
    setIsValidKey,
    role,
    setRole,
    credentials,
    setCredentials,
    isTouchedKey,
    setIsTouchedKey,
  };
  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
}

export const useRegisterData = () => useContext(RegisterContext);
