"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Setting: React.FC = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Setting</h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-500">{">"}</span>
            <span className="text-gray-500">Setting</span>
          </div>
        </div>

        {/* Setting Options */}
        <div className="space-y-4">
          {/* Personal Information */}
          <div
            onClick={() => handleNavigate("/dashboard/setting/personalinfo")}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-900 font-medium">Personal Information</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>

          {/* Change Password */}
          <div
            onClick={() => handleNavigate("/dashboard/setting/update-password")}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="text-gray-900 font-medium">Change Password</span>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;