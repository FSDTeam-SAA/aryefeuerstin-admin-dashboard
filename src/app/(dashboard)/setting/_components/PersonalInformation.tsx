"use client";

import React, { useState } from "react";
import { Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PersonalInfoForm {
  fullName: string;
  userName: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  profileImage: string;
}

const PersonalInformation: React.FC = () => {
  const [formData, setFormData] = useState<PersonalInfoForm>({
    fullName: "Mr. Raja",
    userName: "raja123",
    phoneNumber: "+1 (888) 000-0000",
    gender: "",
    dateOfBirth: "",
    address: "00000 Artesia Blvd, Suite A-000",
    profileImage: "/placeholder.svg",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    console.log("Form cancelled");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Setting</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-500">{">"}</span>
            <span className="text-gray-500">Setting</span>
            <span className="text-gray-500">{">"}</span>
            <span className="text-gray-500">Personal Information</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.profileImage} alt="Profile" />
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-2xl">
                    {formData.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {formData.fullName}
                </h2>
              </div>
            </div>
            <Button
              onClick={() => document.getElementById("profileImage")?.click()}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-0"
            >
              <Upload className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Full Name and User Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              {/* User Name */}
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium text-gray-700">
                  User Name
                </Label>
                <Input
                  id="userName"
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
            </div>

            {/* Phone Number and Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                  Gender
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                >
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date of Birth and Address Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  placeholder="Set your Birthday"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                  className="bg-white"
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-6 border-red-300 text-red-600 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;