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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersManagementModal } from "@/components/Modal/UsersManagementModal";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: string;
  profileImage?: string;
  driverRequestStatus?: string;
  hasActiveSubscription?: boolean;
  subscriptionExpireDate?: string | null;
}

const RESULTS_PER_PAGE = 10;

const UsersManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/all-users?page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      return res.json();
    },
  });

  const users: Member[] = data?.data?.users || [];
  const pagination = data?.data?.paginationInfo;

  const totalPages = Number(pagination?.totalPages || 1);
  const hasNextPage = pagination?.hasNextPage;
  const hasPrevPage = pagination?.hasPrevPage;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Users Management
        </h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          Dashboard <span>{">"}</span> Users Management
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Driver Status</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Expire Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  {/* User */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImage || ""} />
                        <AvatarFallback>
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>{user.email}</TableCell>

                  {/* Phone */}
                  <TableCell>{user.phone || "-"}</TableCell>

                  {/* Gender */}
                  <TableCell className="capitalize">
                    {user.gender || "-"}
                  </TableCell>

                  {/* Driver Status */}
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        user.driverRequestStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : user.driverRequestStatus === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.driverRequestStatus || "-"}
                    </span>
                  </TableCell>

                  {/* Subscription */}
                  <TableCell>
                    {user.hasActiveSubscription ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-red-500 font-medium">Inactive</span>
                    )}
                  </TableCell>

                  {/* Expire Date */}
                  <TableCell>
                    {user.subscriptionExpireDate
                      ? new Date(
                          user.subscriptionExpireDate
                        ).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <UsersManagementModal userId={user._id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <Button
              variant="outline"
              size="icon"
              disabled={!hasPrevPage}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={currentPage === page ? "default" : "outline"}
                className={
                  currentPage === page
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : ""
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
              disabled={!hasNextPage}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
