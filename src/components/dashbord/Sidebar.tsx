// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { signOut, useSession } from "next-auth/react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   LayoutDashboard,
//   Scooter,
//   Users,
//   DollarSign,
//   CarFront,
//   User,
//   HandCoins,
//   Settings,
//   Menu,
//   X,
//   LogOut,
// } from "lucide-react";

// /* =========================
//    Navigation with Permission
// ========================= */
// const navigation = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//     permission: "Dashboard Access",
//   },
//   {
//     name: "Driver Assignment",
//     href: "/dashboard/driver-assignment",
//     icon: Scooter,
//     permission: "Drivers Management",
//   },
//   {
//     name: "Membership Status",
//     href: "/dashboard/membership-status",
//     icon: Users,
//     permission: "Membership Management",
//   },
//   {
//     name: "Payment Status",
//     href: "/dashboard/payment-status",
//     icon: DollarSign,
//     permission: "Payment Management",
//   },
//   {
//     name: "Pickup History",
//     href: "/dashboard/pickup-history",
//     icon: CarFront,
//     permission: "Pickup History",
//   },
//   {
//     name: "Users Management",
//     href: "/dashboard/users-management",
//     icon: User,
//     permission: "Admin Management",
//   },
//   {
//     name: "Workers Management",
//     href: "/dashboard/workers-management",
//     icon: User,
//     permission: "Workers Management",
//   },
//   {
//     name: "Subscription",
//     href: "/dashboard/subscription-management",
//     icon: HandCoins,
//     permission: "Subscription Management",
//   },
//   {
//     name: "Order Requests",
//     href: "/dashboard/order-requests",
//     icon: Settings,
//     permission: "Order Requests",
//   },
//   {
//     name: "Settings",
//     href: "/dashboard/setting",
//     icon: Settings,
//     permission: "Admin Settings",
//   },
// ];

// export interface SessionUser {
//   id: string;
//   name?: string;
//   email?: string;
//   role: "ADMIN" | "SUPER_ADMIN";
//   permissions: string[];
//   profileImage?: string;
// }

// export function Sidebar() {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const [isLogoutOpen, setIsLogoutOpen] = useState(false);

//   const pathname = usePathname();
//   const { data: session } = useSession();

//   const user = session?.user as SessionUser | undefined;
//   const permissions: string[] = user?.permissions ?? [];
//   console.log(permissions)
//   const role = user?.role;

//   const filteredNavigation = navigation.filter((item) => {
//     // SUPER_ADMIN → all access
//     if (role === "SUPER_ADMIN") return true;

//     // ADMIN → permission based (dashboard included)
//     if (role === "ADMIN") {
//       return item.permission && permissions.includes(item.permission);
//     }

//     return false;
//   });

//   const SidebarContent = () => (
//     <div className="flex h-full flex-col bg-white pt-16 lg:pt-3">
//       {/* Logo */}
//       <div className="hidden lg:flex h-16 items-center justify-center px-6 pt-10">
//         <Image
//           src="/logo.png"
//           alt="logo"
//           width={150}
//           height={150}
//           className="object-contain"
//         />
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-2 px-3 py-4 mt-6">
//         {filteredNavigation.map((item) => {
//           const isActive =
//             pathname === item.href ||
//             (item.href !== "/dashboard" && pathname.startsWith(item.href));

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               onClick={() => setIsMobileOpen(false)}
//               className={cn(
//                 "flex items-center gap-3 px-3 h-12 rounded-md text-sm font-semibold transition",
//                 isActive
//                   ? "bg-[#CD9B46] text-white"
//                   : "text-gray-600 hover:bg-[#CD9B46]/60 hover:text-white"
//               )}
//             >
//               <item.icon
//                 className={cn(
//                   "h-5 w-5",
//                   isActive ? "text-white" : "text-gray-500"
//                 )}
//               />
//               {item.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* User Info + Logout */}
//       <div className="p-6 border-t">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="border rounded-full w-10 h-10 ">
//             <Image
//               src={session?.user?.profileImage || "/avatar.png"}
//               alt="avatar"
//               width={900}
//               height={900}
//               className="object-cover w-full h-full rounded-full"
//             />
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-gray-800">
//               {session?.user?.name}
//             </p>
//             <p className="text-xs text-gray-500">{session?.user?.email}</p>
//           </div>
//         </div>

//         <button
//           onClick={() => setIsLogoutOpen(true)}
//           className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500 py-2 text-red-500 hover:bg-red-50"
//         >
//           <LogOut size={18} />
//           Log out
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         onClick={() => setIsMobileOpen(!isMobileOpen)}
//         className="fixed top-4 left-4 z-50 rounded-md bg-[#34813C] p-2 text-white lg:hidden"
//       >
//         {isMobileOpen ? <X /> : <Menu />}
//       </button>

//       {/* Desktop Sidebar */}
//       <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
//         <SidebarContent />
//       </div>

//       {/* Mobile Sidebar */}
//       <div
//         className={cn(
//           "fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform lg:hidden",
//           isMobileOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <SidebarContent />
//       </div>

//       {/* Overlay */}
//       {isMobileOpen && (
//         <div
//           className="fixed inset-0 z-30 bg-black/50 lg:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Logout Modal */}
//       {isLogoutOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="w-full max-w-md rounded-lg bg-white p-6">
//             <h2 className="text-lg font-semibold">Confirm Logout</h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Are you sure you want to log out?
//             </p>

//             <div className="mt-6 flex justify-end gap-3">
//               <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-[#2D7A3E] text-white"
//                 onClick={() => signOut({ callbackUrl: "/login" })}
//               >
//                 Log Out
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Scooter,
  Users,
  DollarSign,
  CarFront,
  User,
  HandCoins,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: "Overview",
  },
  {
    name: "Driver Management",
    href: "/dashboard/driver-assignment",
    icon: Scooter,
    permission: "Drivers Management",
  },
  {
    name: "Membership Status",
    href: "/dashboard/membership-status",
    icon: Users,
    permission: "Membership Status",
  },
  {
    name: "Payment Status",
    href: "/dashboard/payment-status",
    icon: DollarSign,
    permission: "Payments Status",
  },
  {
    name: "Pickup History",
    href: "/dashboard/pickup-history",
    icon: CarFront,
    permission: "Pickup History",
  },
  {
    name: "Order Management",
    href: "/dashboard/order-requests",
    icon: Settings,
    permission: "Orders request",
  },
  {
    name: "Users Management",
    href: "/dashboard/users-management",
    icon: User,
    permission: "User Management",
  },
  {
    name: "Workers Management",
    href: "/dashboard/workers-management",
    icon: User,
    permission: "All Access",
  },
  {
    name: "Subscription",
    href: "/dashboard/subscription-management",
    icon: HandCoins,
    permission: "Subscription Management",
  },
  {
    name: "Driver Working Hours",
    href: "/dashboard/driver-working-hours",
    icon: HandCoins,
    permission: "Subscription Management",
  },
  {
    name: "Contact Management",
    href: "/dashboard/contact-management",
    icon: Settings,
    permission: "Contacts Management",
  },
  {
    name: "Banner Management",
    href: "/dashboard/banner-management",
    icon: Settings,
    permission: "Banner Management",
  },

  {
    name: "Settings",
    href: "/dashboard/setting",
    icon: Settings,
    permission: "Settings",
  },
];

export interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role: "ADMIN" | "SUPER_ADMIN";
  permissions: string[];
  profileImage?: string;
}

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as SessionUser | undefined;

  console.log(session, "SESSION");

  const permissions: string[] = user?.permissions ?? [];
  const role = user?.role;

  // Filter navigation based on role and permissions
  const filteredNavigation = navigation.filter((item) => {
    if (role === "SUPER_ADMIN") return true;
    if (role === "ADMIN") {
      // "All Access" permission grants all routes
      if (permissions.includes("All Access")) return true;
      return item.permission && permissions.includes(item.permission);
    }
    return false;
  });

  // const session = useSession();
  const TOKEN = session?.user?.accessToken || ""; // Ensure
  const { data: userData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return res.json();
    },
  });

  const SidebarContent = () => (
    <div className="flex h-full flex-col w-full bg-white pt-16 lg:pt-3">
      {/* Logo */}
      <div className="hidden lg:flex h-16 items-center justify-center px-6 pt-10">
        <Image
          src="/logo.png"
          alt="logo"
          width={150}
          height={150}
          className="object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-3 mt-6">
        {filteredNavigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 h-12 rounded-md text-sm font-semibold transition",
                isActive
                  ? "bg-[#CD9B46] text-white"
                  : "text-gray-600 hover:bg-[#CD9B46]/60 hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-gray-500",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="p-6 border-t">
        <div className="flex items-center gap-3 mb-4">
          <div className="border rounded-full w-10 h-10 overflow-hidden flex-shrink-0">
            <Image
              src={userData?.data?.user?.profileImage || "/avatar.png"}
              alt="avatar"
              width={40}
              height={40}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
          <div>
            {/* <p className="text-sm font-semibold text-gray-800">
              {session?.user?.name}
            </p> */}
            <p className="text-xs text-gray-500">{session?.user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500 py-2 text-red-500 hover:bg-red-50"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 rounded-md bg-[#34813C] p-2 text-white lg:hidden"
      >
        {isMobileOpen ? <X /> : <Menu />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform lg:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent />
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Logout Modal */}
      {isLogoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="text-lg font-semibold">Confirm Logout</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to log out?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsLogoutOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-[#2D7A3E] text-white"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
