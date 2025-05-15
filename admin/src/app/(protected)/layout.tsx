"use client";
import MainWrapper from "@/components/atoms/main-wrapper";
import Header from "@/components/organisms/Header";
import { AppSidebar } from "@/components/organisms/Sidebar";
import { useSession } from "@/components/providers/SessionProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    return (
      <MainWrapper>
        <p>Memuat...</p>
      </MainWrapper>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
}
