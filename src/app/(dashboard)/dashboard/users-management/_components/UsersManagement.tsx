"use client";

import React, { useState, useMemo } from "react";
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

interface Member {
  id: number;
  name: string;
  date: string;
  email: string;
  avatar?: string;
}

const TOTAL_RESULTS = 1608;
const RESULTS_PER_PAGE = 10;

const UsersManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const members: Member[] = useMemo(
    () =>
      Array.from({ length: RESULTS_PER_PAGE }, (_, index) => ({
        id: (currentPage - 1) * RESULTS_PER_PAGE + index + 1,
        name: "John Smith",
        date: "15/8/2025",
        email: "example@gmail.com",
        avatar: "/placeholder.svg",
      })),
    [currentPage]
  );

  const totalPages = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);

  const handleApprove = (id: number): void => {
    console.log("Approve member:", id);
  };

  const handleRemove = (id: number): void => {
    console.log("Remove member:", id);
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Users Management
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-500">{">"}</span>
            <span className="text-gray-500">Users Management</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b-2">
                <TableHead className="font-semibold text-gray-900">
                  Driver Management
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Date
                </TableHead>
                <TableHead className="font-semibold text-gray-900">
                  Email
                </TableHead>
                <TableHead className="text-right font-semibold text-gray-900">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id} className="border-b hover:bg-gray-50">
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

                  <TableCell className="text-gray-700">{member.date}</TableCell>
                  <TableCell className="text-gray-700">{member.email}</TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white px-4"
                        onClick={() => handleApprove(member.id)}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white px-4"
                        onClick={() => handleRemove(member.id)}
                      >
                        Remove
                      </Button>

                      <UsersManagementModal />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Showing 1 to 6 of 12 results
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

export default UsersManagement;