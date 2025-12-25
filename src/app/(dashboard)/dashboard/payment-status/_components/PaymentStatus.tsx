"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { PaymentStatusModal } from "@/components/Modal/PaymentStatusModal";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface RevenueItem {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  amount: number;
  currency: string;
  status: "PAID" | "PENDING";
  createdAt: string;
  bookingType: string;
  returnOrderId: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    summary: {
      paidPaymentsRevenue: number;
      planRevenue: number;
      totalRevenue: number;
    };
    items: RevenueItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const RESULTS_PER_PAGE = 10;

const PaymentStatus: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["revenue-data", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/revenue?page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch revenue data");
      return res.json();
    },
  });

  const totalPages = data?.data.pagination.pages || 1;
  const totalResults = data?.data.pagination.total || 0;
  const totalRevenue = data?.data.summary.totalRevenue || 0;

  // Filter items by search query (client-side)
  const filteredItems =
    data?.data.items.filter((item) =>
      `${item.user.firstName} ${item.user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Revenue</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>{">"}</span>
                <span>Revenue</span>
              </div>
            </div>
          </div>

          {/* Revenue Card and Search */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-lg p-6 min-w-[280px]">
              <p className="text-sm font-medium mb-2 opacity-90">Total Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue}</p>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by User Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-4 pl-4 py-2 w-full border-gray-300"
                />
              </div>
              <Button size="icon" className="bg-blue-500 hover:bg-blue-600 text-white">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b">
                <TableHead className="font-semibold text-gray-700">User Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Booking Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                <TableHead className="font-semibold text-gray-700">Time</TableHead>
                <TableHead className="font-semibold text-gray-700">Phone Number</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700 text-end">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading revenue data...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No revenue data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50 border-b">
                    <TableCell>
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {item.user.firstName[0].toUpperCase()}
                            {item.user.lastName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">
                          {item.user.firstName} {item.user.lastName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-gray-700">{item.bookingType}</TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      ${item.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(item.createdAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-gray-700">{item.user.phone || "N/A"}</TableCell>
                    <TableCell className="text-gray-700">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Badge
                          className={
                            item.status === "PAID"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                              : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-0"
                          }
                        >
                          {item.status === "PAID" ? "Successful" : "Pending"}
                        </Badge>
                        <PaymentStatusModal revenueId={item._id} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of {totalResults} results
            </p>

            <div className="flex items-center gap-1">
              {/* Previous */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-blue-500 hover:bg-blue-600 text-white h-9 min-w-9"
                      : "border-gray-300 h-9 min-w-9"
                  }
                >
                  {page}
                </Button>
              ))}

              {/* Next */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
