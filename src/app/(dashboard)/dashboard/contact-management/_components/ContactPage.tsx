"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";

/* -------------------- MODAL -------------------- */
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
          <h2 className="text-lg font-semibold">Delete Contact</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mb-6">
          Are you sure you want to delete contact{" "}
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

/* -------------------- PAGE -------------------- */

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  createdAt: string;
}

const RESULTS_PER_PAGE = 10;

const ContactPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact?page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete contact");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setDeleteModalOpen(false);
      setSelectedContact(null);
    },
  });

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedContact) {
      deleteMutation.mutate(selectedContact._id);
    }
  };

  const contacts: Contact[] = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = Number(pagination?.totalPages || 1);
  const totalResults = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Contact Messages
        </h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          Dashboard <span>{">"}</span> Contacts
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b text-black font-bold text-base">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="flex justify-end mr-5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading contacts...
                </TableCell>
              </TableRow>
            ) : contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No contacts found
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact._id}>
                  <TableCell className="font-medium">
                    {contact.name}
                  </TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {contact.message}
                  </TableCell>
                  <TableCell>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex justify-end mr-4">
                    <Button
                      size="icon"
                      className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDeleteClick(contact)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination (unchanged) */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of{" "}
            {totalResults} results
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={page === currentPage ? "default" : "outline"}
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
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        planTitle={selectedContact?.name}
      />
    </div>
  );
};

export default ContactPage;
