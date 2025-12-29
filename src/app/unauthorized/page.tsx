"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-14 w-14 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-6">
          You do not have permission to access this page.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/">
            <Button className="w-full bg-[#2D7A3E] text-white">
              Go to Dashboard
            </Button>
          </Link>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Login with another account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
