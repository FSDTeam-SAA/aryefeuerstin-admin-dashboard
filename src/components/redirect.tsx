"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role: "ADMIN" | "SUPER_ADMIN";
  permissions: string[];
  profileImage?: string;
}

// MUST match sidebar and middleware exactly
const navigation = [
  { name: "Dashboard", href: "/dashboard", permission: "Overview" },
  { name: "Driver Management", href: "/dashboard/driver-assignment", permission: "Drivers Management" },
  { name: "Membership Status", href: "/dashboard/membership-status", permission: "Membership Status" },
  { name: "Payment Status", href: "/dashboard/payment-status", permission: "Payments Status" },
  { name: "Pickup History", href: "/dashboard/pickup-history", permission: "Pickup History" },
  { name: "Order Requests", href: "/dashboard/order-requests", permission: "Orders request" },
  { name: "Users Management", href: "/dashboard/users-management", permission: "User Management" },
  { name: "Workers Management", href: "/dashboard/workers-management", permission: "All Access" },
  { name: "Subscription", href: "/dashboard/subscription-management", permission: "Subscription Management" },
  { name: "Driver Working Hours", href: "/dashboard/driver-working-hours", permission: "Subscription Management" },
  { name: "Settings", href: "/dashboard/setting", permission: "Settings" },
];

const RootRedirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const user = session?.user as SessionUser | undefined;

  useEffect(() => {
    // Wait for authentication to complete
    if (status === "loading") return;

    // Not authenticated → go to login
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // Authenticated → redirect based on role/permissions
    if (status === "authenticated" && !isRedirecting) {
      setIsRedirecting(true);

      const permissions: string[] = user?.permissions ?? [];
      const role = user?.role;

      // 1️⃣ SUPER ADMIN → Dashboard
      if (role === "SUPER_ADMIN") {
        router.replace("/dashboard");
        return;
      }

      // 2️⃣ ADMIN with "All Access" → Dashboard
      if (role === "ADMIN" && permissions.includes("All Access")) {
        router.replace("/dashboard");
        return;
      }

      // 3️⃣ ADMIN → First permitted route
      if (role === "ADMIN") {
        const allowedRoute = navigation.find((item) =>
          permissions.includes(item.permission)
        );

        if (allowedRoute) {
          router.replace(allowedRoute.href);
        } else {
          // No permissions → unauthorized
          router.replace("/unauthorized");
        }
        return;
      }

      // 4️⃣ Fallback
      router.replace("/unauthorized");
    }
  }, [session, status, router, user, isRedirecting]);

  // Show loading while checking auth or redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-lg font-medium text-gray-700">
          {status === "loading" 
            ? "Checking authentication..." 
            : "Redirecting to your dashboard..."}
        </p>
      </div>
    </div>
  );
};

export default RootRedirect;