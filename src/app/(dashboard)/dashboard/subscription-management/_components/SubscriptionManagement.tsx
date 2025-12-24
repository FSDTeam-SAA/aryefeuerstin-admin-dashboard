"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: number;
  planName: string;
  price: string;
  billingCycle: string;
  subscribers: number;
  date: string;
  status: "Active" | "Inactive";
}

const TOTAL_RESULTS = 1608;
const RESULTS_PER_PAGE = 10;

const SubscriptionManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const subscriptions: Subscription[] = useMemo(
    () =>
      Array.from({ length: RESULTS_PER_PAGE }, (_, index) => {
        const plans = [
          "Premium",
          "Premium",
          "Basic",
          "Free",
          "Free",
          "Basic",
          "Basic",
          "Premium",
        ];
        const prices = [
          "$29.00",
          "$28.00",
          "$9.99",
          "$0.00",
          "$0.00",
          "$9.99",
          "$9.99",
          "$29.00",
        ];
        const cycles = [
          "Yearly",
          "Yearly",
          "Monthly",
          "01 month",
          "01 month",
          "Monthly",
          "Monthly",
          "Yearly",
        ];
        const subs = [120, 85, 45, 65, 40, 25, 10, 14];
        const dates = [
          "Oct 06, 2025",
          "Sep 01, 2025",
          "Aug 16, 2025",
          "July 08, 2025",
          "June 10, 2025",
          "May 12, 2025",
          "Apr 14, 2025",
          "Mar 06, 2025",
        ];
        const statuses: ("Active" | "Inactive")[] = [
          "Active",
          "Active",
          "Active",
          "Inactive",
          "Active",
          "Active",
          "Inactive",
          "Inactive",
        ];

        const idx = index % 8;
        return {
          id: (currentPage - 1) * RESULTS_PER_PAGE + index + 1,
          planName: plans[idx],
          price: prices[idx],
          billingCycle: cycles[idx],
          subscribers: subs[idx],
          date: dates[idx],
          status: statuses[idx],
        };
      }),
    [currentPage]
  );

  const totalPages = Math.ceil(TOTAL_RESULTS / RESULTS_PER_PAGE);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        {/* <div className="mb-6 flex items-center justify-between">
          <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6">
            Pricing Plans
          </Button>

          <Link href="/subscription-management/add">
            <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6">
              <Plus className="h-4 w-4" /> Create New Subscription
            </Button>
          </Link>
        </div> */}

        {/* Table */}
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium py-3 px-10 text-gray-700">
                  Plan Name
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Price
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Billing Cycle
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Subscribers
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Date
                </TableHead>
                <TableHead className="font-medium text-gray-700">
                  Status
                </TableHead>
                {/* <TableHead className="text-right font-medium text-gray-700">
                  Action
                </TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {subscriptions.map((subscription) => (
                <TableRow key={subscription.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium py-10 px-10">
                    {subscription.planName}
                  </TableCell>

                  <TableCell>{subscription.price}</TableCell>

                  <TableCell>{subscription.billingCycle}</TableCell>

                  <TableCell>{subscription.subscribers}</TableCell>

                  <TableCell>{subscription.date}</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        subscription.status === "Active"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border-0"
                          : "bg-red-100 text-red-700 hover:bg-red-100 border-0"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </TableCell>
{/* 
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <SubscriptionManagementModal />
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDelete(subscription.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell> */}
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button variant="default">{currentPage}</Button>

              <Button
                variant="outline"
                size="icon"
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

export default SubscriptionManagement;
