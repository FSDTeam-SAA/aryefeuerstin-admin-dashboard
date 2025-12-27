"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
}

interface ShowDriversModalProps {
  onSelectDriver: (driver: Driver) => void;
  onClose: () => void;
  onAssign: () => void;
  selectedDriverId: string | null;
}

export function ShowDriversModal({
  onSelectDriver,
  onClose,
  onAssign,
  selectedDriverId,
}: ShowDriversModalProps) {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["drivers"],
    enabled: !!TOKEN,
    queryFn: async () => {
      if (!TOKEN) return [];
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-drivers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch drivers");
      }

      const json = await res.json();
      return json.data.drivers as Driver[];
    },
  });

  const handleDriverSelect = (driver: Driver) => {
    onSelectDriver(driver);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select a Driver</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
          {isLoading && <p>Loading drivers...</p>}
          {!isLoading &&
            data?.map((driver) => (
              <div
                key={driver._id}
                className={`flex items-center p-2 border rounded-lg cursor-pointer transition-colors ${
                  selectedDriverId === driver._id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleDriverSelect(driver)}
              >
                <Image
                  width={40}
                  height={40}
                  src={driver.profileImage || "/default-avatar.png"}
                  alt={driver.firstName}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">
                    {driver.firstName} {driver.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{driver.email}</p>
                  <p className="text-sm text-gray-500">{driver.phone}</p>
                </div>
                {selectedDriverId === driver._id && (
                  <span className="text-blue-500 font-bold ml-2">✓</span>
                )}
              </div>
            ))}
          {!isLoading && (!data || data.length === 0) && (
            <p className="text-center text-gray-500">No drivers found</p>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAssign} disabled={!selectedDriverId}>
            Assign Driver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}