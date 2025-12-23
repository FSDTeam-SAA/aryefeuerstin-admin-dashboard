"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Eye } from "lucide-react";
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

interface Order {
  id: number;
  name: string;
  email: string;
  zipCode: string;
  street: string;
  city: string;
  avatar?: string;
  checked: boolean;
}

const TOTAL_RESULTS = 1608;
const RESULTS_PER_PAGE = 10;

const OrderRequests: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [orders, setOrders] = useState<Order[]>(
    useMemo(
      () =>
        Array.from({ length: RESULTS_PER_PAGE }, (_, index) => ({
          id: (currentPage - 1) * RESULTS_PER_PAGE + index + 1,
          name: "John Smith",
          email: "example@gmail.com",
          zipCode: "12345",
          street: "street no 16",
          city: "Dhaka",
          avatar: "/placeholder.svg",
          checked: false,
        })),
      [currentPage]
    )
  );

  const totalPages = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);

  const handleCheckboxChange = (id: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, checked: !order.checked } : order
      )
    );
  };

  const handleView = (id: number): void => {
    console.log("View order:", id);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
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

          {/* Search Bar and Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by User Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-4 pl-4 py-2 w-full border-gray-300"
                />
              </div>
              <Button
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6">
                Create Route and Assign Driver
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-medium text-gray-700">Customer Name</TableHead>
                <TableHead className="font-medium text-gray-700">Email</TableHead>
                <TableHead className="font-medium text-gray-700">Zip Code</TableHead>
                <TableHead className="font-medium text-gray-700">Street</TableHead>
                <TableHead className="font-medium text-gray-700">City</TableHead>
                <TableHead className="text-right font-medium text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={order.checked}
                      onCheckedChange={() => handleCheckboxChange(order.id)}
                    />
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={order.avatar} alt={order.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {order.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{order.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>{order.email}</TableCell>
                  <TableCell>{order.zipCode}</TableCell>
                  <TableCell>{order.street}</TableCell>
                  <TableCell>{order.city}</TableCell>

                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        size="icon"
                        className="h-8 w-8 rounded-md bg-orange-400 hover:bg-orange-500 text-white"
                        onClick={() => handleView(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Showing 1 to 5 of 12 results
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === "..." ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300 h-9 min-w-9"
                      disabled
                    >
                      ...
                    </Button>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "bg-orange-400 hover:bg-orange-500 text-white h-9 min-w-9"
                          : "border-gray-300 h-9 min-w-9"
                      }
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </Button>
                  )}
                </React.Fragment>
              ))}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-gray-300"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
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

export default OrderRequests;