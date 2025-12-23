"use client";

import React, { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PaymentStatusModal } from "@/components/Modal/PaymentStatusModal";

interface Member {
  id: number;
  name: string;
  bookingType: string;
  amount: string;
  time: string;
  phoneNumber: string;
  date: string;
  status: "Pending" | "Successful";
  avatar?: string;
}

const TOTAL_RESULTS = 1608;
const RESULTS_PER_PAGE = 10;

const PaymentStatus: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const members: Member[] = useMemo(
    () =>
      Array.from({ length: RESULTS_PER_PAGE }, (_, index) => ({
        id: (currentPage - 1) * RESULTS_PER_PAGE + index + 1,
        name: "Hans Wilkerson",
        bookingType: index % 4 === 0 ? "Pay-Per-Package" : 
                     index % 4 === 1 ? "Standard Package" : 
                     index % 4 === 2 ? "Premium Package" : 
                     index % 4 === 3 ? "Package coming soon" : "Free Visa 1",
        amount: index % 4 === 0 ? "$30" : index % 4 === 1 ? "$45" : "$333",
        time: "20.05 AM",
        phoneNumber: "+02463245",
        date: "11/7/16",
        status: index % 3 === 0 ? "Pending" : "Successful",
        avatar: "/placeholder.svg",
      })),
    [currentPage]
  );

  const totalPages = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);
  const totalRevenue = "$132,570.00";

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
             <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Revenue
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>{">"}</span>
                <span>Revenue</span>
              </div>
            </div>
          </div>
        </div>

          {/* Revenue Card and Search */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-lg p-6 min-w-[280px]">
              <p className="text-sm font-medium mb-2 opacity-90">
                Total Revenue
              </p>
              <p className="text-3xl font-bold">{totalRevenue}</p>
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
              <Button
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
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
                <TableHead className="font-semibold text-gray-700">
                  User Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Booking Type
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Amount
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Time
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Phone Number
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-end">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50 border-b">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gray-200 text-gray-700">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-gray-900">
                        {member.name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {member.bookingType}
                  </TableCell>
                  <TableCell className="text-gray-700 font-medium">
                    {member.amount}
                  </TableCell>
                  <TableCell className="text-gray-700">{member.time}</TableCell>
                  <TableCell className="text-gray-700">
                    {member.phoneNumber}
                  </TableCell>
                  <TableCell className="text-gray-700">{member.date}</TableCell>

                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Badge
                        className={
                          member.status === "Successful"
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                            : "bg-orange-100 text-orange-700 hover:bg-orange-100 border-0"
                        }
                      >
                        {member.status}
                      </Badge>
                      <PaymentStatusModal />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">Showing 1 to 8 of 12 results</p>

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
                    <span className="px-3 py-1 text-gray-500">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === page
                          ? "bg-blue-500 hover:bg-blue-600 text-white h-9 min-w-9"
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

export default PaymentStatus;