/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { OrderRequestDetailsModal } from "@/components/Modal/OrderRequestDetailsModal";
import { ShowDriversModal } from "@/components/Modal/ShowDriversModal";
import { ShowRouteModal } from "@/components/Modal/ShowRouteModal";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order {
  _id: string;
  customer: {
    fullName: string;
    lastName: string;
    email: string;
    address: {
      zipCode: string;
      street: string;
      city: string;
    };
  };
  user?: {
    profileImage?: string;
  };
  status: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    totalOrders: number;
    items: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const RESULTS_PER_PAGE = 10;

const OrderRequests = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");           // general search (e.g. name/email)
  const [cityFilter, setCityFilter] = useState("");
  const [streetFilter, setStreetFilter] = useState("");
  const [zipCodeFilter, setZipCodeFilter] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [assignmentResponse, setAssignmentResponse] = useState<any>(null);

  // Fetch orders
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: [
      "order-requests",
      currentPage,
      searchQuery,
      selectedStatus,
      cityFilter,
      streetFilter,
      zipCodeFilter,
    ],
    enabled: Boolean(TOKEN),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(RESULTS_PER_PAGE),
      });

      if (selectedStatus) {
        params.append("status", selectedStatus);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (cityFilter.trim()) {
        params.append("city", cityFilter.trim());
      }
      if (streetFilter.trim()) {
        params.append("street", streetFilter.trim());
      }
      if (zipCodeFilter.trim()) {
        params.append("zipCode", zipCodeFilter.trim());
      }

      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/return-orders?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!res.ok) throw new Error("Failed to fetch order requests");
      return res.json();
    },
  });

  const orders = data?.data.items ?? [];
  const totalPages = data?.data.pagination.pages ?? 1;
  const totalResults = data?.data.pagination.total ?? 0;

  // Reset page when filters change
  const resetPageOnFilterChange = () => {
    setCurrentPage(1);
    setSelectedOrders([]); // also clear selection when filters change
  };

  // Handle checkbox select - only for PENDING orders
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const isAllSelected =
    pendingOrders.length > 0 &&
    pendingOrders.every((o) => selectedOrders.includes(o._id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(pendingOrders.map((o) => o._id));
    }
  };

  const shouldShowCheckboxes = !selectedStatus;

  // Mutation to assign driver
  const assignDriverMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDriverId || selectedOrders.length === 0) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/assign-driver`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            driverId: selectedDriverId,
            orderIds: selectedOrders,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to assign driver");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["order-requests"] });
      setSelectedOrders([]);
      setSelectedDriverId(null);
      setAssignmentResponse(data.data);
      setIsAssignModalOpen(false);
      setIsSuccessModalOpen(true);
    },
  });

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status === "all" ? "" : status);
    resetPageOnFilterChange();
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityFilter(e.target.value);
    resetPageOnFilterChange();
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreetFilter(e.target.value);
    resetPageOnFilterChange();
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCodeFilter(e.target.value);
    resetPageOnFilterChange();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Orders Management
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>›</span>
                <span>Return Orders</span>
              </div>
            </div>
          </div>
            {/* Assign button */}
            {shouldShowCheckboxes && (
              <div className="flex justify-end">
                <Button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6"
                  disabled={selectedOrders.length === 0}
                  onClick={() => setIsAssignModalOpen(true)}
                >
                  Create Route & Assign Driver
                </Button>
              </div>
            )}

          {/* Filters */}
          <div className="mb-6 space-y-4 mt-5">
            <div className="flex items-center gap-4">
              {/* Status */}
              <div className="w-48">
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={selectedStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="UNASSIGNED" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">UNASSIGNED ORDERS</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="ON_MY_WAY">ON MY WAY</SelectItem>
                    <SelectItem value="PICKED_UP">PICKED UP</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              

              {/* Search by name/email */}
              <div className="flex-1 w-10">
                <label className="block text-sm font-medium mb-1">
                  Search (name/email)
                </label>
                <div className="relative">
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      resetPageOnFilterChange();
                    }}
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* City */}
              <div className="w-44">
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  placeholder="e.g. New York"
                  value={cityFilter}
                  onChange={handleCityChange}
                />
              </div>

              {/* Street */}
              <div className="w-56">
                <label className="block text-sm font-medium mb-1">Street</label>
                <Input
                  placeholder="e.g. 123 Main St"
                  value={streetFilter}
                  onChange={handleStreetChange}
                />
              </div>

              {/* Zip Code */}
              <div className="w-40">
                <label className="block text-sm font-medium mb-1">Zip Code</label>
                <Input
                  placeholder="e.g. 10001"
                  value={zipCodeFilter}
                  onChange={handleZipChange}
                />
              </div>
            </div>

          
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  {shouldShowCheckboxes && (
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  )}
                </TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Zip Code</TableHead>
                <TableHead>Street</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell>
                      {shouldShowCheckboxes && order.status === "PENDING" && (
                        <Checkbox
                          checked={selectedOrders.includes(order._id)}
                          onCheckedChange={() => toggleOrderSelection(order._id)}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 py-2">
                        <p>{order.customer.fullName}</p>
                        {/* <span className="font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </span> */}
                      </div>
                    </TableCell>

                    <TableCell className="text-sm">{order.customer.email}</TableCell>
                    <TableCell>{order.customer.address.zipCode}</TableCell>
                    <TableCell>{order.customer.address.street}</TableCell>
                    <TableCell>{order.customer.address.city}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "ON_MY_WAY"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "PICKED_UP"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "CANCELLED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <OrderRequestDetailsModal orderRequestId={order._id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalResults > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1}–
                {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of{" "}
                {totalResults} results
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page = currentPage - 3 + i;
                  if (page < 1) page = 1;
                  if (page > totalPages) page = totalPages;
                  return page;
                })
                  .filter((v, i, a) => a.indexOf(v) === i) // remove duplicates
                  .map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? "default" : "outline"}
                      className={
                        currentPage === page
                          ? "bg-orange-500 hover:bg-orange-600 text-white"
                          : ""
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

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

        {/* Modals */}
        {isAssignModalOpen && (
          <ShowDriversModal
            onSelectDriver={(driver) => setSelectedDriverId(driver._id)}
            onClose={() => setIsAssignModalOpen(false)}
            onAssign={() => assignDriverMutation.mutate()}
            selectedDriverId={selectedDriverId}
          />
        )}

        {isSuccessModalOpen && (
          <ShowRouteModal
            isOpen={isSuccessModalOpen}
            onClose={handleSuccessClose}
            responseData={assignmentResponse}
          />
        )}
      </div>
    </div>
  );
};

export default OrderRequests;