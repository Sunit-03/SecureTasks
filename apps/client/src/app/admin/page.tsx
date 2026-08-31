"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// No Home/insights view yet (needs new aggregate endpoints) — land on the
// section that's actually built.
export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/users");
  }, [router]);

  return null;
}
