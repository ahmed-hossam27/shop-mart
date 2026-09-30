"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !isAuthed) router.replace("/login");
  }, [ready, isAuthed, router]);

  if (!ready || !isAuthed) {
    return <div className="container-page py-24 text-center text-ink-soft">Loading…</div>;
  }

  return children;
}
