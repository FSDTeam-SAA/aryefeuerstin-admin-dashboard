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
import { MembershipStatusModal } from "@/components/Modal/MembershipStatusModal";
// import { Badge } from "@/components/ui/badge";

interface Member {
  id: number;
  name: string;
  membershipType: string;
  phoneNumber: string;
  date: string;
  avatar?: string;
}

const TOTAL_RESULTS = 1608;
const RESULTS_PER_PAGE = 8;

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const members: Member[] = useMemo(
    () =>
      Array.from({ length: RESULTS_PER_PAGE }, (_, index) => ({
        id: (currentPage - 1) * RESULTS_PER_PAGE + index + 1,
        name: "Hans Wilkerson",
        membershipType: "Standard Package",
        phoneNumber: "+02463245",
        date: "12/10/13",
        avatar: "/placeholder.svg",
      })),
    [currentPage]
  );

  const totalPages = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);

  const handleRemove = (id: number): void => {
    console.log("Remove member:", id);
  };


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
              {members.map((member) => (
                <TableRow key={member.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={member.avatar}
                          alt={member.name}
                        />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>{member.membershipType}</TableCell>
                  <TableCell>{member.phoneNumber}</TableCell>
                  <TableCell>{member.date}</TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemove(member.id)}
                      >
                        Remove
                      </Button>

                      <MembershipStatusModal />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * RESULTS_PER_PAGE, TOTAL_RESULTS)} of{" "}
              {TOTAL_RESULTS} results
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button variant="default">{currentPage}</Button>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(totalPages, prev + 1)
                  )
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

export default UserManagement;
