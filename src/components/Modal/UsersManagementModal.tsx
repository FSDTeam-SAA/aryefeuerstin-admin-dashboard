"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Eye, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

/* =======================
   Types (API Accurate)
======================= */
interface UsersManagementModalProps {
  userId: string;
}

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  pickupAddress?: string;
  dob?: string | null;
  gender?: string;
  role?: string;
  bio?: string;
  profileImage?: string;
  hasActiveSubscription?: boolean;
  subscriptionExpireDate?: string | null;
  driverRequestStatus?: string;
  language?: string;
  address?: {
    country?: string;
    cityState?: string;
    roadArea?: string;
    postalCode?: string;
    taxId?: string;
  };
  createdAt?: string;
}

/* =======================
   Component
======================= */
export function UsersManagementModal({ userId }: UsersManagementModalProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data: userData, isLoading } = useQuery<UserData>({
    queryKey: ["user-details", userId],
    enabled: open,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const json = await res.json();
      return json.data;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            User Details
          </DialogTitle>
        </DialogHeader>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : userData ? (
          <div className="space-y-5">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.profileImage || ""} />
                <AvatarFallback>
                  {userData.firstName?.[0]}
                  {userData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-lg font-semibold">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Gender:</span>{" "}
                {userData.gender || "-"}
              </p>

              {/* <p>
                <span className="font-medium">DOB:</span>{" "}
                {userData.dob
                  ? new Date(userData.dob).toLocaleDateString()
                  : "-"}
              </p> */}

              <p>
                <span className="font-medium">Role:</span>{" "}
                {userData.role}
              </p>

              <p>
                <span className="font-medium">Subscription:</span>{" "}
                {userData.hasActiveSubscription ? "Active" : "Inactive"}
              </p>

              <p>
                <span className="font-medium">Driver Status:</span>{" "}
                {userData.driverRequestStatus}
              </p>

              <p>
                <span className="font-medium">Language:</span>{" "}
                {userData.language}
              </p>
            </div>

            {/* Bio */}
            {userData.bio && (
              <div>
                <p className="font-medium">Bio</p>
                <p className="text-gray-600">{userData.bio}</p>
              </div>
            )}

            {/* Pickup Address */}
            {userData.pickupAddress && (
              <p>
                <span className="font-medium">Address:</span>{" "}
                {userData.pickupAddress}
              </p>
            )}

            {/* Address
            {userData.address && (
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-600">
                  {userData.address.roadArea},{" "}
                  {userData.address.cityState},{" "}
                  {userData.address.country}{" "}
                  {userData.address.postalCode}
                </p>
                {userData.address.taxId && (
                  <p className="text-gray-600">
                    Tax ID: {userData.address.taxId}
                  </p>
                )}
              </div>
            )} */}

            {/* Joined Date */}
            {userData.createdAt && (
              <p className="text-sm text-gray-500">
                Joined:{" "}
                {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No user data found
          </p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
