/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";

interface Props {
  orderRequestId?: string;
}

interface ApiResponse {
  data: any;
}

export function OrderRequestDetailsModal({ orderRequestId }: Props) {
  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["orderRequestDetails", orderRequestId],
    enabled: !!orderRequestId,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/see-details/${orderRequestId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }

      return res.json();
    },
  });

  const order = data?.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="bg-orange-500 text-white">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Order Request Details
          </DialogTitle>
        </DialogHeader>

        {isLoading && <p className="text-center text-sm">Loading...</p>}

        {isError && (
          <p className="text-center text-sm text-red-500">
            Failed to load order details
          </p>
        )}

        {order && (
          <div className="space-y-6 text-sm">
            {/* Status */}
            <div className="flex gap-3">
              <Badge variant="secondary">{order.status}</Badge>
              <Badge variant="outline">{order.paymentStatus}</Badge>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="border-b pb-1 font-semibold mb-2">
                Customer Information
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>
                    {order.customer.firstName} {order.customer.lastName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{order.customer.email}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{order.customer.phone || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Address</span>
                  <span>{order.customer.address?.street}</span>
                </div>
              </div>
            </div>

            {/* Pickup Info */}
            <div>
              <h3 className="border-b pb-1 font-semibold mb-2">
                Pickup Details
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup Address</span>
                  <span>{order.customer.pickupLocation?.address}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructions</span>
                  <span>{order.customer.pickupInstructions}</span>
                </div>
              </div>
            </div>

            {/* Stores */}
            <div>
              <h3 className="border-b pb-1 font-semibold mb-2">
                Stores & Packages
              </h3>

              <div className="space-y-3">
                {order.stores?.map((store: any, idx: number) => (
                  <div key={idx} className="border rounded p-3">
                    <p className="font-medium">{store.store}</p>
                    <p className="text-muted-foreground">
                      Packages: {store.numberOfPackages}
                    </p>

                    <ul className="list-disc pl-5 mt-2">
                      {store.packages?.map((pkg: any, i: number) => (
                        <li key={i}>{pkg.packageNumber}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div>
              <h3 className="border-b pb-1 font-semibold mb-2">Options</h3>
              <div className="flex gap-2 flex-wrap">
                {order.options?.physicalReturnLabel?.enabled && (
                  <Badge>Physical Return Label</Badge>
                )}
                {order.options?.physicalReceipt?.enabled && (
                  <Badge>Physical Receipt</Badge>
                )}
                {order.options?.returnShippingLabel?.enabled && (
                  <Badge>Return Shipping Label</Badge>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="border-b pb-1 font-semibold mb-2">
                Pricing Summary
              </h3>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Amount</span>
                  <span>${order.pricing.baseAmount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Extra Fees</span>
                  <span>${order.pricing.extraFees}</span>
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.pricing.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Driver */}
            {order.assignedDriver && (
              <div>
                <h3 className="border-b pb-1 font-semibold mb-2">
                  Assigned Driver
                </h3>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span>
                      {order.assignedDriver.firstName}{" "}
                      {order.assignedDriver.lastName}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{order.assignedDriver.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
