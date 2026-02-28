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
import { useSession } from "next-auth/react";
import { Eye } from "lucide-react";
import Image from "next/image";

interface Props {
  orderRequestId?: string;
}

interface ApiResponse {
  data: any;
}

export function OrderRequestDetailsModal({ orderRequestId }: Props) {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["orderRequestDetails", orderRequestId],
    enabled: !!orderRequestId && !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/see-details/${orderRequestId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch order details");
      }

      return res.json();
    },
  });

  const order = data?.data;

  // Helper function to check if file is PDF
  const isPDF = (fileUrl: string) => {
    return fileUrl.toLowerCase().endsWith(".pdf");
  };

  const isFreePhysicalLabel =
    order?.user?.subscription?.planId?.entitlements?.freePhysicalReturnLabel;
  const isFreePhysicalReceipt =
    order?.user?.subscription?.planId?.entitlements?.freePhysicalReceipt;
  // const rushServiceEnabled = order.user.subscription.planId.entitlements.rushService;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Request Details
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <p className="text-center py-8 text-muted-foreground">
            Loading order details...
          </p>
        )}

        {isError && (
          <p className="text-center py-8 text-red-500">
            Failed to load order details. Please try again.
          </p>
        )}

        {order && (
          <div className="space-y-7 text-sm mt-4">
            {/* Status Badges */}
<div className="flex flex-wrap gap-3 items-center">

  {/* Order Created Date */}
  <div className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-[#F4F9F2] border border-[#BADA55]">
    <span className="text-sm font-semibold text-[#00253E] whitespace-nowrap">
      📅 Date & Time:
    </span>
    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
      {new Date(order.createdAt).toLocaleString()}
    </span>
  </div>

  <Badge className="h-10 px-4 text-sm flex items-center">
    {order.status}
  </Badge>

  <Badge variant="outline" className="h-10 px-4 text-sm flex items-center">
    Payment: {order.paymentStatus}
  </Badge>

  {order.rushService?.enabled && (
    <Badge variant="destructive" className="h-10 px-4 text-sm flex items-center">
      RUSH SERVICE
    </Badge>
  )}
</div>

            {/* Customer Information */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{order.customer.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="text-muted-foreground">Phone</span>
                  <span>{order.customer.phone || "N/A"}</span>
                </div>
                <div className="flex justify-between md:col-span-2">
                  <span className="text-muted-foreground">Address</span>
                  <span className="text-right">
                    {order.customer.address.street},<br />
                    {order.customer.address.city},{" "}
                    {order.customer.address.zipCode}, {order.customer.unit}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <span className="text-gray-600">Card Last 4 Digits</span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    •••• {order.options.physicalReceipt.creditCardLast4}
                  </span>
                </div>
              </div>
            </div>

            {/* Pickup Details */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                Pickup Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pickup Location</span>
                  <span className="max-w-xs text-right">
                    {order.customer.pickupLocation?.address ||
                      "Same as customer address"}
                  </span>
                </div>
                {order.customer.pickupInstructions && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Instructions</span>
                    <span className="max-w-xs text-right">
                      {order.customer.pickupInstructions}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Message - THIS IS WHAT YOU WANTED */}
            {order.options?.message?.enabled && (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3 text-orange-600">
                  Customer Message
                </h3>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
                  <p className="text-base whitespace-pre-wrap font-medium text-gray-800">
                    {order.options.message.note || "No message provided"}
                  </p>
                </div>
              </div>
            )}

            {/* Stores & Packages */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                Stores & Packages
              </h3>
              <div className="space-y-4">
                {order.stores?.map((store: any, idx: number) => (
                  <div key={idx} className="border rounded-lg p-5 bg-gray-50">
                    <p className="font-semibold text-lg mb-2">
                      {store.store === "OTHER"
                        ? store.otherStoreName
                        : store.store}
                    </p>
                    <p className="text-muted-foreground mb-3">
                      Number of Packages: {store.numberOfPackages}
                    </p>

                    {store.packages?.map((pkg: any, i: number) => (
                      <div key={i} className="mt-4">
                        <p className="font-medium">
                          Package #{pkg.packageNumber}
                        </p>
                        {pkg.barcodeImages?.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                            {pkg.barcodeImages.map(
                              (img: string, imgIdx: number) => (
                                <Image
                                  key={imgIdx}
                                  src={img}
                                  alt={`Barcode ${pkg.packageNumber} - ${imgIdx + 1}`}
                                  width={200}
                                  height={100}
                                  className="rounded border bg-white p-2"
                                />
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Options Selected */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                Selected Options
              </h3>

              <div className="flex flex-wrap gap-3">
                {order.options?.physicalReturnLabel?.enabled && (
                  <Badge variant="default" className="px-4 py-2">
                    Physical Return Label{" "}
                    {!isFreePhysicalLabel ? (
                      <span className="text-green-600 font-medium">
                        (Free with plan)
                      </span>
                    ) : (
                      <span className="text-amber-700">
                        (+${order.options.physicalReturnLabel.fee || 3.5})
                      </span>
                    )}
                  </Badge>
                )}

                {order.options?.physicalReceipt?.enabled && (
                  <Badge variant="default" className="px-4 py-2">
                    Physical Receipt{" "}
                    {!isFreePhysicalReceipt ? (
                      <span className="text-green-600 font-medium">
                        (Free with plan)
                      </span>
                    ) : (
                      <span className="text-amber-700">
                        (+${order.options.physicalReceipt.fee || 8}) - Last 4
                        digits:{" "}
                        {order.options.physicalReceipt.creditCardLast4 || "N/A"}
                      </span>
                    )}
                  </Badge>
                )}

                {order.rushService?.enabled && (
                  <Badge variant="destructive" className="px-4 py-2">
                    Rush Service (+${order.rushService.fee})
                  </Badge>
                )}

                {order.options?.message?.enabled && (
                  <Badge variant="default" className="px-4 py-2">
                    Leave Message
                  </Badge>
                )}
              </div>

              {/* Show Physical Return Label - PDF or Image */}
              {order.options?.physicalReturnLabel?.labelFiles?.length > 0 && (
                <div className="mt-5">
                  <p className="font-medium mb-3">Physical Return Label:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.options.physicalReturnLabel.labelFiles.map(
                      (file: string, idx: number) => (
                        <div key={idx}>
                          {isPDF(file) ? (
                            <iframe
                              src={file}
                              className="w-full h-96 rounded-lg border shadow"
                              title={`Physical Return Label PDF ${idx + 1}`}
                            />
                          ) : (
                            <Image
                              src={file}
                              alt="Physical Return Label"
                              width={400}
                              height={300}
                              className="rounded-lg border shadow"
                            />
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                Pricing Summary
              </h3>
              <div className="space-y-2 bg-gray-50 rounded-lg p-5">
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Amount</span>
                  <span>${order.pricing.baseAmount}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Extra Fees (Options + Rush)
                  </span>
                  <span>${order.pricing.extraFees}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    ${order.pricing.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Driver */}
            {order.assignedDriver ? (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Assigned Driver
                </h3>
                <div className="space-y-2">
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
            ) : (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Driver Assignment
                </h3>
                <Badge variant="outline">UNASSIGNED</Badge>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
