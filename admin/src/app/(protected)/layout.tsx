"use client";
import MainWrapper from "@/components/atoms/main-wrapper";
import { useSession } from "@/components/providers/SessionProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <MainWrapper>
      <p>Memuat...</p>
    </MainWrapper>;
  }

  return <>{children}</>;
}
