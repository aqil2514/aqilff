"use client";

import { logoutUser } from "@/lib/utils";
import { Button } from "../atoms/button";
import MainWrapper from "../atoms/main-wrapper";

export default function DashboardTemplate() {
  
  return (
    <MainWrapper>
      <Button
        className="bg-red-500 hover:bg-red-600 cursor-pointer duration-200 active:scale-90"
        onClick={logoutUser}
      >
        Logout
      </Button>
    </MainWrapper>
  );
}
