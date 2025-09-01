import { supabase } from "@/lib/supabaseClient";
import axios, { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type UserInputs = {
  username: string;
  password: string;
};

export function useLoginFormLogics() {
  const { register, handleSubmit } = useForm<UserInputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<UserInputs> = async (formData) => {
    try {
      const { data } = await axios.post("/api/auth", formData);
      const { access_token, refresh_token } = data;

      await supabase.auth.setSession({ access_token, refresh_token });
      toast(data.message, { type: "success" });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        toast(data.message, { type: "error" });
      }
      console.error(error);
    }
  };

  return { register, router, handleSubmit, onSubmit };
}
