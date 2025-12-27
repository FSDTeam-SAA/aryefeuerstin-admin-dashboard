"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  // LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Scooter,
  DollarSign,
  Users,
  CarFront,
  User,
  HandCoins,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: " Driver assignment",
    href: "/dashboard/driver-assignment",
    icon: Scooter,
  },
  { name: "Membership status", href: "/dashboard/membership-status", icon: Users },
  { name: "Payment status", href: "/dashboard/payment-status", icon: DollarSign },
  { name: "Pickup history", href: "/dashboard/pickup-history", icon: CarFront },

  { name: "Users Management", href: "/dashboard/users-management", icon: User },
  { name: "Subscription", href: "/dashboard/subscription-management", icon: HandCoins },
  { name: "Order Requests", href: "/dashboard/order-requests", icon: Settings },
  { name: "Setting", href: "/dashboard/setting", icon: Settings },
];

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  console.log(session)

  const handleLogout = () => setIsModalOpen(true);


  const cancelLogout = () => setIsModalOpen(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-[#FFFFFF] text-white pt-16 lg:pt-3">
      {/* Logo */}
      <div className="hidden lg:flex h-16 items-center justify-center px-6 pt-10 ">
        <Image
          src={"/logo.png"}
          width={500}
          height={500}
          alt="logo"
          className="w-[150px] h-[150px]  object-cover"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-3 px-3 py-4 mt-6">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 h-[48px] text-base font-semibold rounded-md transition-colors",
                isActive
                  ? "bg-[#CD9B46] text-white hover:bg-[#CD9B46]/90"
                  : "text-[#616161] hover:bg-[#CD9B46]/60 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-white" : "text-[#616161]"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}


      </nav>

      {/* Logout */}
      <div className="max-w-xs mx-auto p-6 bg-white rounded-lg  text-center">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="flex gap-3">
            <Image
              src={session?.user?.profileImage || ""}
              alt="User Avatar"
              width={80}
              height={80}
              className="w-10 h-10 rounded-full mb-4"
            />
            <div>
              <h2 className="text-[12px] font-semibold text-gray-800">{session?.user?.name}</h2>
              <p className="text-sm text-gray-500 mb-4">{session?.user?.email}</p>

            </div>
          </div>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-[#F2415A] text-[#F2415A] rounded-lg hover:bg-red-50 transition"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ✅ Always visible Mobile Menu Button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 flex items-center justify-center rounded-md bg-[#34813C] text-white p-2 shadow-md focus:outline-none focus:ring-2 focus:ring-white lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* ✅ Mobile sidebar (Slide-in) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[#34813C] text-white transition-transform duration-300 ease-in-out lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent />
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Logout
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to log out?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelLogout}
                className="text-gray-600 hover:text-gray-900 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={() => signOut({ callbackUrl: "/login" })} className="bg-[#2D7A3E] hover:bg-[#3A8F4E] text-white">
                Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
