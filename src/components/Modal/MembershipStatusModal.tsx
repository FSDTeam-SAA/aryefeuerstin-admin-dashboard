"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";

interface Membership {
  _id: string;
  email: string;
  phone: string;
  hasActiveSubscription: boolean;
  startDate: string;
  endDate: string;
  membershipType: string;
  billingCycle: string;
  price: number;
}

interface MembershipStatusModalProps {
  member: Membership;
}

export function MembershipStatusModal({ member }: MembershipStatusModalProps) {
  // Example: fetching single membership details if needed
  const { data: singleMemberData, isLoading } = useQuery({
    queryKey: ["membership-detail", member._id],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/memberships?planId=${member._id}`
      );
      if (!res.ok) throw new Error("Failed to fetch membership details");
      return res.json();
    },
    enabled: !!member._id,
  });

  const details = singleMemberData?.data?.items?.[0] || member;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="text-blue-600 hover:text-white hover:bg-blue-500 transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Membership Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading details...</p>
        ) : !details ? (
          <p className="text-center py-6 text-gray-500">No details found</p>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-gray-900">User Info</h3>
              <p>
                <span className="font-medium">Email: </span>
                {details.email}
              </p>
              <p>
                <span className="font-medium">Phone: </span>
                {details.phone || "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-gray-900">Membership</h3>
              <p>
                <span className="font-medium">Type: </span>
                {details.membershipType}
              </p>
              <p>
                <span className="font-medium">Billing Cycle: </span>
                {details.billingCycle}
              </p>
              <p>
                <span className="font-medium">Price: </span>${details.price}
              </p>
              <p>
                <span className="font-medium">Active: </span>
                {details.hasActiveSubscription ? (
                  <Badge className="bg-green-500 text-white px-2 py-1">
                    Yes
                  </Badge>
                ) : (
                  <Badge className="bg-red-500 text-white px-2 py-1">
                    No
                  </Badge>
                )}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-gray-900">Duration</h3>
              <p>
                <span className="font-medium">Start Date: </span>
                {new Date(details.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">End Date: </span>
                {new Date(details.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
