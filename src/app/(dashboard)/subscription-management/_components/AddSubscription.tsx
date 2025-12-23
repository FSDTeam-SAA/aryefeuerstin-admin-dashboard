"use client";

import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";

interface SubscriptionForm {
  planName: string;
  price: string;
  billingCycle: string;
  title: string;
  packageIncludes: string;
}

const AddSubscription: React.FC = () => {
  const [formData, setFormData] = useState<SubscriptionForm>({
    planName: "",
    price: "",
    billingCycle: "",
    title: "",
    packageIncludes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleCancel = () => {
    setFormData({
      planName: "",
      price: "",
      billingCycle: "",
      title: "",
      packageIncludes: "",
    });
  };

  return (
    <div className="bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Add Subscription 
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-500">{">"}</span>
            <span className="text-gray-500">Add Subscription</span>
          </div>
        </div>
      <div className="mt-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Name and Price Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Name */}
            <div className="space-y-2">
              <Label htmlFor="planName" className="text-sm font-medium text-gray-700">
                Plan Name
              </Label>
              <Select
                value={formData.planName}
                onValueChange={(value) =>
                  setFormData({ ...formData, planName: value })
                }
              >
                <SelectTrigger className="w-full bg-white h-[45px]">
                  <SelectValue placeholder="Premium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price
              </Label>
              <Input
                id="price"
                type="text"
                placeholder="$29.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="bg-white h-[45px]"
              />
            </div>
          </div>

          {/* Billing Cycle and Title Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Cycle */}
            <div className="space-y-2">
              <Label htmlFor="billingCycle" className="text-sm font-medium text-gray-700">
                Billing Cycle
              </Label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value) =>
                  setFormData({ ...formData, billingCycle: value })
                }
              >
                <SelectTrigger className="w-full bg-white h-[45px]">
                  <SelectValue placeholder="Yearly" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="The complete solution for serious business grant seekers"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-white h-[45px]"
              />
            </div>
          </div>

          {/* This Package Include */}
          <div className="space-y-2">
            <Label htmlFor="packageIncludes" className="text-sm font-medium text-gray-700">
              This Package Include
            </Label>
            <Textarea
              id="packageIncludes"
              placeholder="Unlimited grant searches, Unlimited saved grants, Advanced filters & sorting, Personalized recommendations, Deadline reminders & calendar, Export grant details, Expert grant support..."
              value={formData.packageIncludes}
              onChange={(e) =>
                setFormData({ ...formData, packageIncludes: e.target.value })
              }
              className="bg-white min-h-[100px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="px-8 border-red-300 w-[150px] text-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 w-[150px] bg-cyan-400 hover:bg-cyan-500 text-white"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscription;