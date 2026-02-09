"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CircleCheck, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DriverAssignmentModal } from "@/components/Modal/ DriverAssignmentModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/* ================= TYPES ================= */

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  driverRequestStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string | null;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    drivers: Driver[];
    paginationInfo?: {
      currentPage: number;
      totalPages: number;
      totalData: number;
    };
  };
}

const RESULTS_PER_PAGE = 10;

/* ================= COMPONENT ================= */

const DriverAssignment: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<"ALL" | "PENDING">("PENDING");
  const { data: session, status } = useSession();
  const TOKEN = session?.user?.accessToken;

  /* ================= FETCH ================= */

  const { data, isLoading, refetch } = useQuery<ApiResponse>({
    queryKey: ["drivers", filter, currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const url =
        filter === "PENDING"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/driver-requests?status=PENDING`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-drivers?page=${currentPage}&limit=${RESULTS_PER_PAGE}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch drivers");
      return res.json();
    },
  });

  /* ================= MUTATIONS ================= */

  const approveMutation = useMutation({
    mutationFn: async (driverId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/driver/${driverId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Approve failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Driver approved successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to approve driver");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (driverId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/driver/${driverId}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Reject failed");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Driver rejected successfully");
      refetch();
    },
    onError: () => {
      toast.error("Failed to reject driver");
    },
  });

  /* ================= DATA ================= */

  const drivers = data?.data.drivers ?? [];
  const pagination = data?.data.paginationInfo;

  const totalPages = pagination?.totalPages ?? 1;
  const totalResults = pagination?.totalData ?? drivers.length;

  if (status === "loading" || isLoading) {
    return <p className="text-center py-10">Loading drivers...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow">
        {/* HEADER + FILTER */}
        <div className="p-4 flex items-center justify-between">
          <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Driver Management
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>{">"}</span>
                <span>Driver management</span>
              </div>
            </div>
          </div>
        </div>
          <Select
            value={filter}
            onValueChange={(value: "ALL" | "PENDING") => {
              setFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter drivers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Drivers</SelectItem>
              <SelectItem value="PENDING">Pending Drivers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 font-bold text-lg">
              <TableHead>Driver</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {drivers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No drivers found
                </TableCell>
              </TableRow>
            ) : (
              drivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={driver.profileImage || ""} />
                        <AvatarFallback>
                          {driver.firstName[0]}
                          {driver.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {driver.firstName} {driver.lastName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {driver.createdAt
                      ? new Date(driver.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell className="text-center">
                    {driver.email}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      {driver.driverRequestStatus === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              approveMutation.mutate(driver._id)
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              rejectMutation.mutate(driver._id)
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {driver.driverRequestStatus === "APPROVED" && (
                        <CircleCheck className="w-6 h-6 text-green-600" />
                      )}

                      {driver.driverRequestStatus === "REJECTED" && (
                        <Ban className="w-6 h-6 text-red-600" />
                      )}

                      <DriverAssignmentModal driverId={driver._id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filter === "ALL" && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of{" "}
              {totalResults}
            </p>

            <div className="flex items-center gap-2">
              {/* Prev */}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
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
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverAssignment;
