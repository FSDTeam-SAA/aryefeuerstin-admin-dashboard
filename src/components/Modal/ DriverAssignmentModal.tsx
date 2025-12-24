"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface DriverAssignmentModalProps {
  driverId: string;
}

interface Address {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}

interface Subscription {
  planId: string | null;
  startDate: string | null;
  endDate: string | null;
}

interface DriverData {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  pickupAddress?: string | null;
  profileImage?: string;
  drivingLicense?: string;
  driverRequestStatus?: "PENDING" | "APPROVED" | "REJECTED";
  driverApprovedAt?: string | null;
  driverRejectedAt?: string | null;
  driverRejectionReason?: string;
  address?: Address;
  subscription?: Subscription;
}

export function DriverAssignmentModal({ driverId }: DriverAssignmentModalProps) {
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  const { data, isLoading, error } = useQuery<{
    status: boolean;
    message: string;
    data: DriverData;
  }>({
    queryKey: ["driverData", driverId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${driverId}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      if (!res.ok) throw new Error("Failed to fetch driver data");
      return res.json();
    },
    enabled: !!driverId && !!TOKEN,
  });

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "?";
    const f = firstName?.[0] || "";
    const l = lastName?.[0] || "";
    return (f + l).toUpperCase() || "?";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Eye className="w-5 h-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Driver Details</DialogTitle>
          <DialogDescription>
            Complete information of the driver.
          </DialogDescription>
        </DialogHeader>

        {isLoading && <p className="text-center py-5">Loading driver info...</p>}
        {error && <p className="text-center py-5 text-red-600">Failed to load data.</p>}

        {data?.data && (
          <div className="mt-4 space-y-6">

            {/* Profile Card */}
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg shadow-sm">
              <Avatar className="h-20 w-20">
                {data.data.profileImage ? (
                  <AvatarImage src={data.data.profileImage} />
                ) : (
                  <AvatarFallback>
                    {getInitials(data.data.firstName, data.data.lastName)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">
                  {data.data.firstName} {data.data.lastName}
                </h3>
                <p className="text-gray-500">{data.data.role || "—"}</p>
                <p className="text-gray-400">{data.data.email || "—"}</p>
                <p className="text-gray-400">Phone: {data.data.phone || "—"}</p>
              </div>
            </div>

            {/* Driver Status */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-gray-700 mb-2">Driver Status</h4>
              <p>
                Status:{" "}
                <span
                  className={
                    data.data.driverRequestStatus === "APPROVED"
                      ? "text-green-600 font-semibold"
                      : data.data.driverRequestStatus === "REJECTED"
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {data.data.driverRequestStatus || "PENDING"}
                </span>
              </p>
              {data.data.driverApprovedAt && (
                <p>Approved At: {new Date(data.data.driverApprovedAt).toLocaleString()}</p>
              )}
              {data.data.driverRejectedAt && (
                <p>Rejected At: {new Date(data.data.driverRejectedAt).toLocaleString()}</p>
              )}
              {data.data.driverRejectionReason && (
                <p>Rejection Reason: {data.data.driverRejectionReason}</p>
              )}
            </div>

            {/* Pickup Address */}
            {data.data.pickupAddress && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-700 mb-2">Pickup Address</h4>
                <p>{data.data.pickupAddress}</p>
              </div>
            )}

            {/* Driving License */}
            {data.data.drivingLicense && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-700 mb-2">Driving License</h4>
                <div className="w-full h-[300px] relative">
                  <Image
                    src={data.data.drivingLicense}
                    alt="Driving License"
                    fill
                    className="object-contain rounded-md border"
                  />
                </div>
              </div>
            )}

            {/* Address Card */}
            {data.data.address && (
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <h4 className="font-semibold text-gray-700 mb-2">Address Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Country</p>
                    <p className="text-gray-800">{data.data.address.country || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">City / State</p>
                    <p className="text-gray-800">{data.data.address.cityState || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Road / Area</p>
                    <p className="text-gray-800">{data.data.address.roadArea || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Postal Code</p>
                    <p className="text-gray-800">{data.data.address.postalCode || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Tax ID</p>
                    <p className="text-gray-800">{data.data.address.taxId || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
