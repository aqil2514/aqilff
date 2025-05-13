"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import { Button } from "../atoms/button";
import axios from "axios";
import MainWrapper from "../atoms/main-wrapper";

type UserInputs = {
  username: string;
  password: string;
};

export default function AuthTemplate() {
  const { register, handleSubmit } = useForm<UserInputs>();

  const onSubmit: SubmitHandler<UserInputs> = async (formData) => {
    const { data } = await axios.post("/api/auth", formData);
    console.log(data);
  };

  return (
    <MainWrapper>
      <h1 className="font-extrabold text-md sm:text-xl">
        <span className="text-[#df1111]">Aqil</span>{" "}
        <span className="text-[#ffb801]">Frozen </span>{" "}
        <span className="text-[#df1111]">Food</span>
      </h1>
      <div className="bg-white p-4 rounded-2xl w-5/6 md:w-1/2">
        <p className="text-center">Admin Login Form</p>
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

          <Button className="cursor-pointer bg-slate-500 hover:bg-slate-600 active:scale-95 duration-200">
            Login
          </Button>
        </form>
      </div>
    </MainWrapper>
  );
}
