"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface PaymentStatusModalProps {
  revenueId: string;
}

interface RevenueDetailResponse {
  status: boolean;
  message: string;
  data: {
    _id: string;
    amount: number;
    currency: string;
    status: "PAID" | "PENDING";
    createdAt: string;
    bookingType: string;
    user: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      subscription: {
        planId: string;
        startDate: string;
        endDate: string;
      };
    };
    returnOrder: {
      _id: string;
      customer: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        address: {
          zipCode: string;
          street: string;
          city: string;
        };
        pickupLocation: {
          address: string;
          lat: number;
          lng: number;
        };
      };
      stores: {
        store: string;
        numberOfPackages: number;
        packages: {
          packageNumber: string;
          barcodeImages: string[];
        }[];
      }[];
      options: {
        physicalReturnLabel: { enabled: boolean; fee: number };
        physicalReceipt: {
          enabled: boolean;
          creditCardLast4: string;
          fee: number;
        };
        returnShippingLabel: {
          enabled: boolean;
          pickupAndReturnAddress: string;
          dimensions: {
            length: number;
            width: number;
            height: number;
            weight: number;
          };
          fee: number;
        };
        message: { enabled: boolean; note: string };
      };
      pricing: { baseAmount: number; extraFees: number; totalAmount: number };
      status: string;
      paymentStatus: string;
    };
  };
}

export function PaymentStatusModal({ revenueId }: PaymentStatusModalProps) {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const { data, isLoading } = useQuery<RevenueDetailResponse>({
    queryKey: ["single-revenue", revenueId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/revenue/${revenueId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch revenue details");
      return res.json();
    },
    enabled: !!revenueId,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-5 w-5 text-blue-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* max-w-3xl makes modal wider, max-h-[90vh] fixes height and allows scrolling */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Revenue Details
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            All relevant information for this payment and return order.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading details...
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">
                User Information
              </h3>
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {data?.data.user.firstName} {data?.data.user.lastName}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {data?.data.user.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {data?.data.user.phone || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Subscription:</span> Plan{" "}
                {data?.data.user.subscription.planId},{" "}
                {new Date(
                  data?.data.user.subscription.startDate || ""
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  data?.data.user.subscription.endDate || ""
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Revenue Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">
                Payment Information
              </h3>
              <p>
                <span className="font-semibold">Amount:</span> $
                {data?.data?.amount} {data?.data?.currency?.toUpperCase()}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    data?.data.status === "PAID"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  {data?.data.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Booking Type:</span>{" "}
                {data?.data.bookingType}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(data?.data.createdAt || "").toLocaleString()}
              </p>
            </div>

            {/* Return Order Info */}          
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">Return Order</h3>
              <p>
                <span className="font-semibold">Customer:</span>{" "}
                {data?.data?.returnOrder?.customer?.firstName}{" "}    
                {data?.data?.returnOrder?.customer?.lastName}           
              </p>
              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {data?.data?.returnOrder?.customer?.phone}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {data?.data?.returnOrder?.customer?.email}
              </p>
              <p>
                <span className="font-semibold">Pickup Address:</span>{" "}
                {data?.data?.returnOrder?.customer?.pickupLocation?.address}
              </p>
              {data?.data?.returnOrder?.stores?.map((store, index) => (
                <div key={index} className="mt-2 border-t pt-2">
                  <p>
                    <span className="font-semibold">Store:</span> {store?.store}{" "}
                    ({store?.numberOfPackages} packages)
                  </p>
                  {store?.packages?.map((pkg, idx) => (
                    <div key={idx} className="mt-1">
                      <p className="font-medium">{pkg?.packageNumber}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {pkg?.barcodeImages?.map((img, i) => (
                          <Image
                            width={300}
                            height={300}
                            key={i}
                            src={img}
                            alt="barcode"
                            className="h-16 w-28 object-contain border rounded"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Pricing Info */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-2">
                Pricing & Options
              </h3>
              <p>
                <span className="font-semibold">Base Amount:</span> $
                {data?.data.returnOrder?.pricing?.baseAmount}
              </p>
              <p>
                <span className="font-semibold">Extra Fees:</span> $
                {data?.data?.returnOrder?.pricing?.extraFees}
              </p>
              <p>
                <span className="font-semibold">Total Amount:</span> $
                {data?.data?.returnOrder?.pricing?.totalAmount}
              </p>
              {data?.data?.returnOrder?.options?.message?.enabled && (
                <p>
                  <span className="font-semibold">Message Note:</span>{" "}
                  {data?.data?.returnOrder?.options?.message?.note}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
