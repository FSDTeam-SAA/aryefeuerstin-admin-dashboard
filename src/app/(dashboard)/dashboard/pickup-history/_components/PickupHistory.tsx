"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PickupHistoryModal } from "@/components/Modal/PickupHistoryModal";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

/* ================= TYPES ================= */

interface StoreItem {
  store: string;
  numberOfPackages: number;
}

interface PickupItem {
  _id: string;

  // NEW FORMAT
  customer?: {
    fullName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    pickupLocation?: {
      address?: string;
    };
  };

  stores?: StoreItem[];

  // OLD FORMAT
  fullName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  pickupAddress?: string;
  returnStore?: string;
  numberOfPackages?: number;

  status: string;
  createdAt: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: PickupItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const RESULTS_PER_PAGE = 10;

/* ================= HELPERS ================= */

const getName = (item: PickupItem) =>
  item.customer
    ? `${item.customer.fullName ?? ""} ${item.customer.lastName ?? ""}`
    : `${item.fullName ?? ""} ${item.lastName ?? ""}`;

const getEmail = (item: PickupItem) =>
  item.customer?.email ?? item.email ?? "N/A";

const getPhone = (item: PickupItem) =>
  item.customer?.phone ?? item.phone ?? "N/A";

const getPickupAddress = (item: PickupItem) =>
  item.customer?.pickupLocation?.address ??
  item.pickupAddress ??
  "N/A";

const getReturnStore = (item: PickupItem) =>
  item.stores?.map((s) => s.store).join(", ") ??
  item.returnStore ??
  "N/A";

const getTotalPackages = (item: PickupItem) =>
  item.stores?.reduce((sum, s) => sum + s.numberOfPackages, 0) ??
  item.numberOfPackages ??
  0;

/* ================= COMPONENT ================= */

const PickupHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["pickup-history", currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/admin/pickup-history?page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch pickup history");
      return res.json();
    },
  });

  const pickups = data?.data.data ?? [];
  const pagination = data?.data.pagination;

  const totalPages = pagination?.totalPages ?? 1;
  const totalResults = pagination?.totalData ?? pickups.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Pickup History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Dashboard &gt; Pickup history
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Pickup Address</TableHead>
              <TableHead>Return Store</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : pickups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No pickup history found
                </TableCell>
              </TableRow>
            ) : (
              pickups.map((item) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  {/* Name */}
                  <TableCell>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar>
                        <AvatarFallback>
                          {getName(item)[0] ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{getName(item)}</span>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Email */}
                  <TableCell>{getEmail(item)}</TableCell>

                  {/* Phone */}
                  <TableCell>{getPhone(item)}</TableCell>

                  {/* Pickup Address */}
                  <TableCell className="max-w-[220px] truncate">
                    {getPickupAddress(item)}
                  </TableCell>

                  {/* Return Store */}
                  <TableCell>{getReturnStore(item)}</TableCell>

                  {/* Packages */}
                  <TableCell>{getTotalPackages(item)}</TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Badge className="bg-green-500 text-white">
                        {item.status}
                      </Badge>
                      <PickupHistoryModal pickupId={item._id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of{" "}
              {totalResults} results
            </p>

            <div className="flex items-center gap-2">
              {/* Prev */}
              <Button
                size="icon"
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
              >
                <ChevronLeft />
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    className={
                      currentPage === page
                        ? "bg-orange-400 text-white h-9 min-w-9"
                        : "border-gray-300 h-9 min-w-9"
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              {/* Next */}
              <Button
                size="icon"
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupHistory;
