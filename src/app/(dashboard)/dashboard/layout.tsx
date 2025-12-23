"use client";
import type React from "react";
import "../../globals.css";
import { Sidebar } from "@/components/dashbord/Sidebar";
import { DashboardHeader } from "@/components/dashbord/DashboardHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64">
        <DashboardHeader/>
        <main className="p-6 mt-20">{children}</main>
      </div>
    </div>
  );
}