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

interface UsersManagementModalProps {
  userId: string;
}

interface UserData {
  _id: string;
  name?: string;
  email: string;
  dob?: string | null;
  gender?: string;
  role?: string;
  bio?: string;
  profileImage?: string;
  address?: {
    country?: string;
    cityState?: string;
    roadArea?: string;
    postalCode?: string;
    taxId?: string;
  };
  hasActiveSubscription?: boolean;
  subscriptionExpireDate?: string | null;
}

export function UsersManagementModal({ userId }: UsersManagementModalProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data: userData, isLoading } = useQuery<UserData>({
    queryKey: ["user-data", userId],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      const json = await res.json();
      return json.data;
    },
    enabled: open, // fetch only when modal is opened
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg sm:max-w-xl rounded-xl p-6 bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            User Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : userData ? (
          <div className="space-y-4">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.profileImage || ""} alt={userData.name || "User"} />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {userData.name
                    ? userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "NA"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {userData.name || "Unknown User"}
                </h2>
                <p className="text-gray-500">{userData.email}</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <span className="font-medium">Gender:</span> {userData.gender || "-"}
              </div>
              <div>
                <span className="font-medium">Date of Birth:</span>{" "}
                {userData.dob ? new Date(userData.dob).toLocaleDateString() : "-"}
              </div>
              <div>
                <span className="font-medium">Role:</span> {userData.role || "-"}
              </div>
              <div>
                <span className="font-medium">Subscription Active:</span>{" "}
                {userData.hasActiveSubscription ? "Yes" : "No"}
              </div>
              {userData.subscriptionExpireDate && (
                <div>
                  <span className="font-medium">Subscription Expire:</span>{" "}
                  {new Date(userData.subscriptionExpireDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Bio */}
            {userData.bio && (
              <div>
                <h3 className="font-medium text-gray-900">Bio:</h3>
                <p className="text-gray-700">{userData.bio}</p>
              </div>
            )}

            {/* Address */}
            {userData.address && (
              <div className="space-y-1">
                <h3 className="font-medium text-gray-900">Address:</h3>
                <p className="text-gray-700">
                  {userData.address.roadArea || ""}, {userData.address.cityState || ""},{" "}
                  {userData.address.country || ""} {userData.address.postalCode || ""}
                </p>
                {userData.address.taxId && (
                  <p className="text-gray-700">Tax ID: {userData.address.taxId}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">No user data found</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button className="bg-red-500 hover:bg-red-600 text-white">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
