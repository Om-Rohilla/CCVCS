"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onLogout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="secondary" onClick={onLogout} disabled={isLoading}>
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
};
