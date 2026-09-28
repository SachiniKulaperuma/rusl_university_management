import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Portal | RUSL",
  description: "Rajarata University of Sri Lanka - Admin Management Portal",
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {children}
    </div>
  );
}
