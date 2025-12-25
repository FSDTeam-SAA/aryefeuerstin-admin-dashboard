/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Eye, MapPin, Package, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface PickupHistoryModalProps {
  pickupId: string;
}

export function PickupHistoryModal({ pickupId }: PickupHistoryModalProps) {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["pickup-details", pickupId],
    enabled: !!pickupId,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/admin/pickup-history?id=${pickupId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch pickup details");
      return res.json();
    },
  });

  const pickup = data?.data;

  /* ================= Reusable Components ================= */
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold mb-3 text-gray-900">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      {icon}
      <span className="font-medium">{label}:</span>
      <span>{value ?? "N/A"}</span>
    </div>
  );

  const PriceRow = ({ label, value, highlight }: { label: string; value?: number; highlight?: boolean }) => (
    <div className={`flex justify-between text-sm ${highlight ? "font-semibold text-gray-900" : "text-gray-700"}`}>
      <span>{label}</span>
      <span>${value ?? 0}</span>
    </div>
  );

  return (
    <Dialog>
      {/* Eye Button */}
      <DialogTrigger asChild>
        <Button size="icon" className="h-8 w-8 bg-blue-500 hover:bg-blue-600 text-white">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Pickup Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-10 text-gray-500">Loading pickup details...</p>
        ) : !pickup ? (
          <p className="text-center py-10 text-gray-500">No data found</p>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {/* ================= CUSTOMER INFO ================= */}
            <Section title="Customer Information">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={pickup.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={pickup.phone} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="Pickup Address" value={pickup.pickupAddress} />
              {pickup.pickupInstructions && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Instruction:</span> {pickup.pickupInstructions}
                </p>
              )}
            </Section>

            {/* ================= PRICING ================= */}
            {pickup.pricing && (
              <Section title="Pricing Summary">
                <PriceRow label="Base Amount" value={pickup.pricing.baseAmount} />
                <PriceRow label="Extra Fees" value={pickup.pricing.extraFees} />
                <PriceRow label="Total Amount" value={pickup.pricing.totalAmount} highlight />
              </Section>
            )}

            {/* ================= PACKAGES ================= */}
            {pickup.packages?.length > 0 && (
              <Section title={`Packages (${pickup.numberOfPackages ?? 0})`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pickup.packages.map((pkg: any, i: number) => (
                    <div key={i} className="border rounded-md p-3 text-sm">
                      <p className="font-medium">Package No: {pkg.packageNumber ?? "N/A"}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {pkg.barcodeImages?.length > 0 ? (
                          pkg.barcodeImages.map((img: string, index: number) => (
                            <Image
                              key={index}
                              src={img}
                              alt="barcode"
                              width={300}
                              height={300}
                              className="h-16 rounded border"
                            />
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No barcode image</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* ================= RETURN STORE ================= */}
            {pickup.returnStore && (
              <Section title="Return Store">
                <p className="text-gray-700 font-medium">{pickup.returnStore}</p>
              </Section>
            )}

            {/* ================= PRODUCT INFO ================= */}
            <Section title="Product Dimensions & Weight">
              <InfoRow icon={<Package className="h-4 w-4" />} label="Length" value={pickup.productLength} />
              <InfoRow icon={<Package className="h-4 w-4" />} label="Width" value={pickup.productWidth} />
              <InfoRow icon={<Package className="h-4 w-4" />} label="Height" value={pickup.productHeight} />
              <InfoRow icon={<Package className="h-4 w-4" />} label="Weight" value={pickup.productWeight} />
            </Section>

            {/* ================= OPTIONS ================= */}
            <Section title="Options">
              <InfoRow icon={<Badge />} label="Need Shipping Label" value={pickup.needShippingLabel ? "Yes" : "No"} />
              <InfoRow icon={<Badge />} label="Has Receipt" value={pickup.hasReceipt ? `Yes, ****${pickup.creditCardLast4}` : "No"} />
              <InfoRow icon={<Badge />} label="Leave Message" value={pickup.leaveMessage ? "Yes" : "No"} />
              {pickup.messageNote && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Note:</span> {pickup.messageNote}
                </p>
              )}
            </Section>

            {/* ================= STATUS ================= */}
            <Section title="Pickup Status">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500 text-white">{pickup.status ?? "N/A"}</Badge>
                <Badge
                  variant="outline"
                  className={
                    pickup.paymentStatus === "PENDING"
                      ? "border-yellow-500 text-yellow-600"
                      : "border-green-500 text-green-600"
                  }
                >
                  Payment: {pickup.paymentStatus ?? "N/A"}
                </Badge>
              </div>
            </Section>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
