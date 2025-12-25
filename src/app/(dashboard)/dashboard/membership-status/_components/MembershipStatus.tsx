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
import { MembershipStatusModal } from "@/components/Modal/MembershipStatusModal";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Membership {
  _id: string;
  email: string;
  phone: string;
  hasActiveSubscription: boolean;
  startDate: string;
  endDate: string;
  membershipType: string;
  billingCycle: string;
  price: number;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    items: Membership[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

const RESULTS_PER_PAGE = 10;

const MembershipStatus: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  // Fetch memberships with pagination
  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["memberships", currentPage],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/memberships?page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch memberships");
      return res.json();
    },
  });

  const memberships = data?.data.items || [];
  const totalPages = data?.data.pagination.pages || 1;
  const totalResults = data?.data.pagination.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Membership status
              </h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <span>{">"}</span>
                <span>Membership status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>User Name</TableHead>
                <TableHead>Membership Type</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading memberships...
                  </TableCell>
                </TableRow>
              ) : memberships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No memberships found
                  </TableCell>
                </TableRow>
              ) : (
                memberships.map((member) => (
                  <TableRow key={member._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {member.email
                              .split("@")[0]
                              .split("")
                              .slice(0, 2)
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.email}</span>
                      </div>
                    </TableCell>

                    <TableCell>{member.membershipType}</TableCell>
                    <TableCell>{member.phone || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(member.startDate).toLocaleDateString()} -{" "}
                      {new Date(member.endDate).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <MembershipStatusModal member={member} />
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
              {/* Previous */}
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "outline"}
                  className={
                    currentPage === page
                      ? "bg-blue-500 hover:bg-blue-600 text-white h-9 min-w-9"
                      : "border-gray-300 h-9 min-w-9"
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              {/* Next */}
              <Button
                variant="outline"
                size="icon"
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

export default MembershipStatus;
