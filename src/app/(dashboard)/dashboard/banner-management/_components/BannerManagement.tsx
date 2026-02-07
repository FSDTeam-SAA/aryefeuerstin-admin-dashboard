"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, X, Edit, Plus } from "lucide-react";
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
import Image from "next/image";
import { toast } from "sonner";

/* -------------------- DELETE MODAL -------------------- */
const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bannerTitle?: string;
}> = ({ isOpen, onClose, onConfirm, bannerTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Delete Banner</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="mb-6">
          Are you sure you want to delete banner{" "}
          <span className="font-medium">{bannerTitle}</span>?
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

/* -------------------- CREATE/EDIT MODAL -------------------- */
const BannerFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  banner?: Banner | null;
  onSubmit: (formData: FormData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, banner, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState(banner?.title || "");
  const [description, setDescription] = useState(banner?.description || "");
  const [additionalInfo, setAdditionalInfo] = useState(banner?.additionalInfo || "");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>(banner?.media || "");

  React.useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setDescription(banner.description);
      setAdditionalInfo(banner.additionalInfo || "");
      setMediaPreview(banner.media);
    }
  }, [banner]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("additionalInfo", additionalInfo);
    if (mediaFile) formData.append("media", mediaFile);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {banner ? "Edit Banner" : "Create Banner"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Info
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Media {!banner && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-md"
              required={!banner}
            />
            {mediaPreview && (
              <div className="mt-3">
                {mediaPreview.endsWith(".mp4") || mediaFile?.type.startsWith("video/") ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="w-full max-h-48 rounded-md"
                  />
                ) : (
                  <Image
                    src={mediaPreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-full max-h-48 object-cover rounded-md"
                  />
                )}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : banner ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* -------------------- MAIN PAGE -------------------- */

interface Banner {
  _id: string;
  title: string;
  description: string;
  media: string;
  additionalInfo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const RESULTS_PER_PAGE = 10;

const BannerManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);

  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;
  const queryClient = useQueryClient();

  // Fetch Banners
  const { data, isLoading } = useQuery({
    queryKey: ["banners", currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banner?page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch banners");
      return res.json();
    },
  });

  // Create Banner
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banner`,
        { method: "POST", headers: { Authorization: `Bearer ${TOKEN}` }, body: formData }
      );
      if (!res.ok) throw new Error("Failed to create banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setFormModalOpen(false);
      setSelectedBanner(null);
    },
  });

  // Update Banner
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banner/${id}`,
        { method: "PUT", headers: { Authorization: `Bearer ${TOKEN}` }, body: formData }
      );
      if (!res.ok) throw new Error("Failed to update banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setFormModalOpen(false);
      setSelectedBanner(null);
    },
  });

  // Delete Banner
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/banner/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${TOKEN}` } }
      );
      if (!res.ok) throw new Error("Failed to delete banner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteModalOpen(false);
      setSelectedBanner(null);
    },
  });

  const handleDeleteClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setFormModalOpen(true);
  };


  

  const handleCreateClick = () => {
  if (banners.length > 0) {
    // যদি banner থাকে, toast দেখাও
    toast.warning("Please delete the existing banner before creating a new one.");
    return;
  }
  setSelectedBanner(null);
  setFormModalOpen(true);
};

  const handleConfirmDelete = () => {
    if (selectedBanner) deleteMutation.mutate(selectedBanner._id);
  };

  const handleFormSubmit = (formData: FormData) => {
    if (selectedBanner) updateMutation.mutate({ id: selectedBanner._id, formData });
    else createMutation.mutate(formData);
  };

  const banners: Banner[] = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = Number(pagination?.totalPages || 1);
  const totalResults = pagination?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Banner Management
          </h1>
          <Button onClick={handleCreateClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Banner
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          Dashboard <span>{">"}</span> Banners
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b text-black font-bold text-base">
              <TableHead className="text-center">Media</TableHead>
              <TableHead className="text-left">Title</TableHead>
              <TableHead className="text-left">Description</TableHead>
              <TableHead className="text-left">Additional Info</TableHead>
              <TableHead className="text-left">Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Loading banners...
                </TableCell>
              </TableRow>
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No banners found
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell className="text-center w-24 h-14">
                    {banner.media.endsWith(".mp4") ? (
                      <video
                        src={banner.media}
                        className="w-10 h-10 object-cover rounded mx-auto"
                        muted
                      />
                    ) : (
                      <Image
                        src={banner.media}
                        alt={banner.title}
                        width={80}
                        height={80}
                        className="w-10 h-10 object-cover rounded mx-auto"
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{banner.title.slice(0,15)}...</TableCell>
                  <TableCell className="max-w-xs truncate">{banner.description.slice(0,15)}...</TableCell>
                  <TableCell className="max-w-xs truncate">{banner.additionalInfo.slice(0,15) || "—"}...</TableCell>
                  <TableCell>{new Date(banner.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="flex justify-center items-center gap-2">
                    <Button
                      size="icon"
                      className="h-9 w-9 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleEditClick(banner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-9 w-9 bg-red-600 hover:bg-red-700 text-white"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDeleteClick(banner)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-t gap-2 sm:gap-0">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * RESULTS_PER_PAGE + 1} to{" "}
            {Math.min(currentPage * RESULTS_PER_PAGE, totalResults)} of{" "}
            {totalResults} results
          </p>

          <div className="flex gap-2 justify-center sm:justify-end flex-wrap">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

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

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        bannerTitle={selectedBanner?.title}
      />

      <BannerFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedBanner(null);
        }}
        banner={selectedBanner}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default BannerManagement;
