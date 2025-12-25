"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
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
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlansApiResponse } from "@/types/planDataTypes";
import { toast } from "sonner";
import { SubscriptionManagementModal } from "@/components/Modal/SubscriptionManagementModal";
import { useSession } from "next-auth/react";

// Simple modal component
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planTitle?: string;
}> = ({ isOpen, onClose, onConfirm, planTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Delete Plan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="mb-6">
          Are you sure you want to delete the subscription plan{" "}
          <span className="font-medium">{planTitle}</span>?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionManagement: React.FC = () => {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{ id: string; title: string } | null>(null);

  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PlansApiResponse>({
    queryKey: ["plans", page],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan?page=${page}&limit=${limit}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (!res.ok) throw new Error("Failed to fetch plans");
      return res.json();
    },
  });

  const plans = data?.data?.items || [];
  const totalItems = data?.data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / limit);

  const { mutate: deletePlan, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete plan");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscription plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      setDeleteModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete subscription plan");
    },
  });

  const handleDeleteClick = (id: string, title: string) => {
    setPlanToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deletePlan(planToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex justify-end">
        <Link href="/dashboard/subscription-management/add">
          <Button className="bg-cyan-400 hover:bg-cyan-500 text-white px-6">
            <Plus className="h-4 w-4 mr-1" />
            Create New Subscription
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="px-6 py-6">Plan Title</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right px-6">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  Loading plans...
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              plans.map((plan) => (
                <TableRow key={plan._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-8 font-medium">
                    {plan.title}
                  </TableCell>

                  <TableCell>${plan.price}</TableCell>

                  <TableCell className="capitalize">
                    {plan.billingCycle}
                  </TableCell>

                  <TableCell>{plan.totalSubscribers}</TableCell>

                  <TableCell>{plan.features.length}</TableCell>

                  <TableCell>
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={
                        plan.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-end gap-2 px-4">
                      {token && (
                        <SubscriptionManagementModal token={token} plan={plan} />
                      )}
                      <Button
                        size="icon"
                        className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white"
                        disabled={isPending}
                        onClick={() => handleDeleteClick(plan._id, plan.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages} — Total {totalItems} plans
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        planTitle={planToDelete?.title}
      />
    </div>
  );
};

export default SubscriptionManagement;
