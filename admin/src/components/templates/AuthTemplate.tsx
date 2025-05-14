"use client";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import { Button } from "../atoms/button";
import MainWrapper from "../atoms/main-wrapper";
import { useLoginFormLogics } from "../logics/authLogics";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../providers/SessionProvider";

export default function AuthTemplate() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  // Jangan render apapun selama loading atau jika user sudah ada (biar gak flicker)
  if (loading || user) return(
    <MainWrapper>
      <p>Memuat...</p>
    </MainWrapper>
  );

  return (
    <MainWrapper>
      <h1 className="font-extrabold text-md sm:text-xl">
        <span className="text-[#df1111]">Aqil</span>{" "}
        <span className="text-[#ffb801]">Frozen </span>{" "}
        <span className="text-[#df1111]">Food</span>
      </h1>
      <div className="bg-white p-4 rounded-2xl w-5/6 md:w-1/2">
        <p className="text-center">Admin Login Form</p>
        <LoginForm />
      </div>
    </MainWrapper>
  );
}
const LoginForm = () => {
  const { handleSubmit, onSubmit, register, router } = useLoginFormLogics();
  return (
    <form
      className="my-4 flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Username : </Label>
        <Input
          type="text"
          id="username"
          placeholder="Username..."
          {...register("username")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password : </Label>
        <Input
          type="password"
          id="password"
          placeholder="Password..."
          {...register("password")}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <Button
          type="button"
          onClick={() => router.push("/register")}
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 active:scale-95 duration-200"
        >
          Register
        </Button>
        <Button
          type="submit"
          className="cursor-pointer bg-slate-500 hover:bg-slate-600 active:scale-95 duration-200"
        >
          Login
        </Button>
      </div>
    </form>
  );
};
