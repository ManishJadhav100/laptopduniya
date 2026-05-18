"use client";

import type { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}
