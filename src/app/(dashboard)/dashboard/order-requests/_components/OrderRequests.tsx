/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { OrderRequestDetailsModal } from "@/components/Modal/OrderRequestDetailsModal";
import { ShowDriversModal } from "@/components/Modal/ShowDriversModal";
import { ShowRouteModal } from "@/components/Modal/ShowRouteModal";

interface Order {
  _id: string;
  customer: {
    firstName: string;
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
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    orders: Order[];
  };
}

const RESULTS_PER_PAGE = 10;

const OrderRequests = () => {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [assignmentResponse, setAssignmentResponse] = useState<any>(null);

  // Fetch orders
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["order-requests", currentPage, searchQuery],
    enabled: Boolean(TOKEN),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(RESULTS_PER_PAGE),
      });
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/admin/orders-request?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch order requests");
      return res.json();
    },
  });

  const orders = data?.data.orders ?? [];
  const totalPages = data?.data.meta.totalPages ?? 1;
  const totalResults = data?.data.meta.total ?? 0;

  // Handle checkbox select
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const isAllSelected = orders.every((o) => selectedOrders.includes(o._id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

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
      queryClient.invalidateQueries({queryKey : ["order-requests"]});
      setSelectedOrders([]);
      setSelectedDriverId(null);
      setAssignmentResponse(data.data); // Save response data
      setIsAssignModalOpen(false); // Driver modal close
      setIsSuccessModalOpen(true); // Success modal open
    },
  });

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Driver Management
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>{">"}</span>
                <span>Driver Management</span>
              </div>
            </div>
          </div>

          {/* Search & Button */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Input
                placeholder="Search by User Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="icon" className="bg-blue-500 text-white">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="bg-cyan-400 text-white px-6"
                disabled={selectedOrders.length === 0}
                onClick={() => setIsAssignModalOpen(true)}
              >
                Create Route and Assign Driver
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Zip Code</TableHead>
                <TableHead>Street</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order._id)}
                        onCheckedChange={() => toggleOrderSelection(order._id)}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.user?.profileImage ?? ""} />
                          <AvatarFallback>
                            {order.customer.firstName[0]}
                            {order.customer.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {order.customer.firstName} {order.customer.lastName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>{order.customer.email}</TableCell>
                    <TableCell>{order.customer.address.zipCode}</TableCell>
                    <TableCell>{order.customer.address.street}</TableCell>
                    <TableCell>{order.customer.address.city}</TableCell>

                    <TableCell>
                      <div className="flex justify-end">
                        <OrderRequestDetailsModal orderRequestId={order._id} />
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
        </div>

        {/* Assign Driver Modal */}
        {isAssignModalOpen && (
          <ShowDriversModal
            onSelectDriver={(driver) => setSelectedDriverId(driver._id)}
            onClose={() => setIsAssignModalOpen(false)}
            onAssign={() => assignDriverMutation.mutate()}
            selectedDriverId={selectedDriverId}
          />
        )}

        {/* Success Modal */}
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