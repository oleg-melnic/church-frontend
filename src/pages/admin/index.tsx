"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminRedirect: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard");
  }, [router]);

  return null; // Ничего не рендерим, так как это просто перенаправление
};

export default AdminRedirect;