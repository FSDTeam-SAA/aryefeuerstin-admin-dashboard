"use client";

import React, { useEffect, useState } from "react";
import { Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { UserProfileResponse } from "@/types/userDataTypes";

interface PersonalInfoForm {
  fullName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  profileImage: string;
}

const PersonalInformation: React.FC = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const token = (session?.user as { accessToken?: string })?.accessToken;

  const [formData, setFormData] = useState<PersonalInfoForm>({
    fullName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    profileImage: "/placeholder.svg",
  });

  const [originalData, setOriginalData] = useState<PersonalInfoForm | null>(null);

  // ================= Fetch user data =================
  const { data } = useQuery<UserProfileResponse>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (data?.data?.user) {
      const user = data.data.user;
      const userData: PersonalInfoForm = {
        fullName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phone || "",
        email: user.email || "",
        gender: user.gender || "",
        dateOfBirth: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
        address: `${user.address?.roadArea || ""} ${user.address?.cityState || ""}`.trim(),
        profileImage: user.profileImage || "/placeholder.svg",
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [data]);

  // ================= Profile update mutation =================
  const profileMutation = useMutation({
    mutationFn: async (payload: PersonalInfoForm) => {
      if (!token) throw new Error("Unauthorized");

      const body = {
        firstName: payload.fullName,
        lastName: payload.lastName,
        phone: payload.phoneNumber,
        dob: payload.dateOfBirth || null,
        gender: payload.gender,
        address: {
          roadArea: payload.address || "",
          cityState: "",
          country: "",
          postalCode: "",
          taxId: "",
        },
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.message || "Failed to update profile");
      return resData;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setOriginalData(formData);
    },
    onError: (error) => {
      toast.error(error.message || "Update failed");
    },
  });


  const avatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!token) throw new Error("Unauthorized");

      const body = new FormData();
      body.append("profileImage", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Avatar updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err) => {
      toast.error(err.message || "Image upload failed");
    },
  });

  // ================= Handlers =================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (originalData) setFormData(originalData);
    toast.info("Changes discarded");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        profileImage: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Immediately call API
    avatarMutation.mutate(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Setting</h1>
        <div className="flex gap-2 mt-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>{">"}</span>
          <span>Setting</span>
          <span>{">"}</span>
          <span>Personal Information</span>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={formData?.profileImage} />
                <AvatarFallback>
                  {formData?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              {avatarMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </div>
              )}
            </div>

            <input
              type="file"
              id="profileImage"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />

            <h2 className="text-lg font-semibold">{formData.fullName + " " + formData.lastName}</h2>
          </div>

          <Button
            type="button"
            onClick={() => document.getElementById("profileImage")?.click()}
            disabled={avatarMutation.isPending}
            className="bg-blue-50 text-blue-600 hover:bg-blue-100"
          >
            <Upload className="h-4 w-4 mr-2" />
            Update Profile
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Phone Number</Label>
              <Input
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input value={formData.email} disabled />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="text-red-600 border-red-300"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>

          <Button type="submit" className="bg-blue-600 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
