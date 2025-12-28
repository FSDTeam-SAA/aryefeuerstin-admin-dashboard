// "use client";

// import { Loader2 } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// const Redirect = () => {
//     const router = useRouter();
//       const { data: session } = useSession();

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             router.push("/dashboard");
//         }, 500);
//         return () => clearTimeout(timer);
//     }, [router]);

//     return (
//         <div className="flex h-screen w-full items-center justify-center ">
//             <div className="flex flex-col items-center gap-4 rounded-2xlp-8 ">
//                 <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
//                 <p className="text-lg font-medium text-gray-700">
//                     Redirecting to your dashboard...
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Redirect;


"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SessionUser } from "./dashbord/Sidebar";

// your navigation config
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    permission: "Dashboard Access",
  },
  {
    name: "Driver Assignment",
    href: "/dashboard/driver-assignment",
    permission: "Drivers Management",
  },
  {
    name: "Membership Status",
    href: "/dashboard/membership-status",
    permission: "Membership Management",
  },
  {
    name: "Payment Status",
    href: "/dashboard/payment-status",
    permission: "Payment Management",
  },
  {
    name: "Pickup History",
    href: "/dashboard/pickup-history",
    permission: "Pickup History",
  },
  {
    name: "Users Management",
    href: "/dashboard/users-management",
    permission: "Admin Management",
  },
  {
    name: "Workers Management",
    href: "/dashboard/workers-management",
    permission: "Workers Management",
  },
  {
    name: "Subscription",
    href: "/dashboard/subscription-management",
    permission: "Subscription Management",
  },
  {
    name: "Order Requests",
    href: "/dashboard/order-requests",
    permission: "Order Requests",
  },
  {
    name: "Settings",
    href: "/dashboard/setting",
    permission: "Admin Settings",
  },
];

const Redirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

    const user = session?.user as SessionUser | undefined;
  
    const permissions: string[] = user?.permissions ?? [];
    const role = user?.role;

  useEffect(() => {
    if (status !== "authenticated") return;


    // 1️⃣ SUPER ADMIN → Dashboard
    if (role === "SUPER_ADMIN") {
      router.replace("/dashboard");
      return;
    }

    // 2️⃣ ADMIN → First permitted route
    if (role === "ADMIN") {
      const allowedRoute = navigation.find((item) =>
        permissions.includes(item.permission)
      );

      router.replace(allowedRoute?.href || "/dashboard");
      return;
    }

    // fallback
    router.replace("/dashboard");
  }, [session, status, router, permissions, role]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-lg font-medium text-gray-700">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default Redirect;
