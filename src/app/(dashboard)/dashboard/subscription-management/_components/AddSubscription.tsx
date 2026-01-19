/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useMutation } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";

// interface SubscriptionForm {
//   planName: string;
//   price: string;
//   billingCycle: string;
//   title: string;
//   packageIncludes: string;
// }

// const AddSubscription: React.FC = () => {
//     const session = useSession();
//   const token = (session?.data?.user as { accessToken: string })?.accessToken;

//   const [formData, setFormData] = useState<SubscriptionForm>({
//     planName: "",
//     price: "",
//     billingCycle: "",
//     title: "",
//     packageIncludes: "",
//   });


//   const handleCancel = () => {
//     setFormData({
//       planName: "",
//       price: "",
//       billingCycle: "",
//       title: "",
//       packageIncludes: "",
//     });
//   };



//   const  createPlan = useMutation({
//     mutationFn: async (body) => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan`,
//         {
//           method: "POST",
//           headers: { Authorization: `Bearer ${token}` },
//           body: JSON.stringify(body),
//         }
//       );
//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.message || "Failed to create plan");
//       }
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Product created successfully");
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to create product");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const body = {
//       name: formData.planName,
//       price: formData.price,
//       billingCycle: formData.billingCycle,
//       title: formData.title,
//       packageIncludes: formData.packageIncludes,
//     };
//     createPlan.mutate(body);
//   };



//   return (
//     <div className="bg-gray-50">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Add Subscription
//         </h1>
//         <div className="flex items-center gap-2 mt-2 text-sm">
//           <span className="text-gray-500">Dashboard</span>
//           <span className="text-gray-500">{">"}</span>
//           <span className="text-gray-500">Add Subscription</span>
//         </div>
//       </div>
//       <div className="mt-10">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Plan Name and Price Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Plan Name */}
//             <div className="space-y-2">
//               <Label htmlFor="planName" className="text-sm font-medium text-gray-700">
//                 Plan Name
//               </Label>
//               <Select
//                 value={formData.planName}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, planName: value })
//                 }
//               >
//                 <SelectTrigger className="w-full bg-white h-[45px]">
//                   <SelectValue placeholder="Premium" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="premium">Premium</SelectItem>
//                   <SelectItem value="basic">Basic</SelectItem>
//                   <SelectItem value="free">Free</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Price */}
//             <div className="space-y-2">
//               <Label htmlFor="price" className="text-sm font-medium text-gray-700">
//                 Price
//               </Label>
//               <Input
//                 id="price"
//                 type="text"
//                 placeholder="$29.00"
//                 value={formData.price}
//                 onChange={(e) =>
//                   setFormData({ ...formData, price: e.target.value })
//                 }
//                 className="bg-white h-[45px]"
//               />
//             </div>
//           </div>

//           {/* Billing Cycle and Title Row */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Billing Cycle */}
//             <div className="space-y-2">
//               <Label htmlFor="billingCycle" className="text-sm font-medium text-gray-700">
//                 Billing Cycle
//               </Label>
//               <Select
//                 value={formData.billingCycle}
//                 onValueChange={(value) =>
//                   setFormData({ ...formData, billingCycle: value })
//                 }
//               >
//                 <SelectTrigger className="w-full bg-white h-[45px]">
//                   <SelectValue placeholder="Yearly" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="yearly">Yearly</SelectItem>
//                   <SelectItem value="monthly">Monthly</SelectItem>
//                   <SelectItem value="quarterly">Quarterly</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Title */}
//             <div className="space-y-2">
//               <Label htmlFor="title" className="text-sm font-medium text-gray-700">
//                 Title
//               </Label>
//               <Input
//                 id="title"
//                 type="text"
//                 placeholder="The complete solution for serious business grant seekers"
//                 value={formData.title}
//                 onChange={(e) =>
//                   setFormData({ ...formData, title: e.target.value })
//                 }
//                 className="bg-white h-[45px]"
//               />
//             </div>
//           </div>

//           {/* This Package Include */}
//           <div className="space-y-2">
//             <Label htmlFor="packageIncludes" className="text-sm font-medium text-gray-700">
//               This Package Include
//             </Label>
//             <Textarea
//               id="packageIncludes"
//               placeholder="Unlimited grant searches, Unlimited saved grants, Advanced filters & sorting, Personalized recommendations, Deadline reminders & calendar, Export grant details, Expert grant support..."
//               value={formData.packageIncludes}
//               onChange={(e) =>
//                 setFormData({ ...formData, packageIncludes: e.target.value })
//               }
//               className="bg-white min-h-[100px] resize-none"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               className="px-8 border-red-300 w-[150px] text-red-600 hover:bg-red-50"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="px-8 w-[150px] bg-[#31B8FA] hover:bg-[#31B8FA] text-white"
//             >
//               Save
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddSubscription;


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
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface SubscriptionForm {
  name: string;
  title: string;
  price: string;
  billingCycle: string;
  features: string[];  // Fixed: Changed displayFeatures to features for consistency
  numberOfPackages: string;
  maxReturnOrders: string;
  rushService: boolean;
  freePhysicalReturnLabel: boolean;
  freePhysicalReceipt: boolean;
}

const AddSubscription: React.FC = () => {
  const session = useSession();
  const token = (session?.data?.user as { accessToken: string })?.accessToken;

  const [formData, setFormData] = useState<SubscriptionForm>({
    name: "",
    title: "",
    price: "",
    billingCycle: "",
    features: [],  // Fixed: Changed displayFeatures to features
    numberOfPackages: "0",
    maxReturnOrders: "",
    rushService: false,
    freePhysicalReturnLabel: false,
    freePhysicalReceipt: false,
  });

  const [featureInput, setFeatureInput] = useState("");

  const handleCancel = () => {
    setFormData({
      name: "",
      title: "",
      price: "",
      billingCycle: "",
      features: [],  // Fixed: Changed displayFeatures to features
      numberOfPackages: "0",
      maxReturnOrders: "",
      rushService: false,
      freePhysicalReturnLabel: false,
      freePhysicalReceipt: false,
    });
    setFeatureInput("");
  };

  // Add feature
  const addFeature = () => {
    if (!featureInput.trim()) return;
    if (formData.features.includes(featureInput.trim())) {
      toast.error("Feature already added");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, featureInput.trim()],  // Fixed: Changed displayFeatures to features
    }));
    setFeatureInput("");
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),  // Fixed: Changed displayFeatures to features
    }));
  };

  const createPlan = useMutation({
    mutationFn: async (body: any) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create plan");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Plan created successfully");
      handleCancel();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create plan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      price: Number(formData.price),
      billingCycle: formData.billingCycle,
      displayFeatures: formData.features,  // Fixed: Changed displayFeatures to features
      numberOfPackages: Number(formData.numberOfPackages) || 0,
      limits: {
        maxReturnOrders: formData.maxReturnOrders
          ? Number(formData.maxReturnOrders)
          : null,
      },
      entitlements: {
        rushService: formData.rushService,
        freePhysicalReturnLabel: formData.freePhysicalReturnLabel,
        freePhysicalReceipt: formData.freePhysicalReceipt,
      },
    };

    createPlan.mutate(payload);
  };

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Add Subscription
        </h1>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>{">"}</span>
          <span>Add Subscription</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Plan Name (Unique identifier)</Label>
            <Input
              type="text"
              placeholder="PAY_PER_PICKUP"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-[45px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Display Title</Label>
            <Input
              placeholder="Pay-per-package Special"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-[45px] bg-white"
              required
            />
          </div>
        </div>

        {/* Price & Billing Cycle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              placeholder="6"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="h-[45px] bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Billing Cycle</Label>
            <Select
              value={formData.billingCycle}
              onValueChange={(value) =>
                setFormData({ ...formData, billingCycle: value })
              }
            >
              <SelectTrigger className="h-[45px] bg-white">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Number of Packages & Max Return Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Number of Packages Allowed</Label>
            <Input
              type="number"
              min="0"
              placeholder="5"
              value={formData.numberOfPackages}
              onChange={(e) =>
                setFormData({ ...formData, numberOfPackages: e.target.value })
              }
              className="h-[45px] bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Max Return Orders Allowed (0 = unlimited)</Label>
            <Input
              type="number"
              min="0"
              placeholder="1"
              value={formData.maxReturnOrders}
              onChange={(e) =>
                setFormData({ ...formData, maxReturnOrders: e.target.value })
              }
              className="h-[45px] bg-white"
            />
          </div>
        </div>

        {/* Features (Tag System) */}
        <div className="space-y-2">
          <Label>Features / Display Features</Label>

          <div className="flex gap-2">
            <Input
              placeholder="Type feature and click + or press Enter"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="h-[45px] bg-white"
            />
            <Button type="button" onClick={addFeature} className="px-5">
              +
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {formData.features.map((feature, index) => (  // Fixed: Changed displayFeatures to features
              <span
                key={index}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Entitlements */}
        <div className="space-y-4">
          <Label>Entitlements</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rushService"
                checked={formData.rushService}
                onChange={(e) =>
                  setFormData({ ...formData, rushService: e.target.checked })
                }
              />
              <Label htmlFor="rushService">Rush Service</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="freePhysicalReturnLabel"
                checked={formData.freePhysicalReturnLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freePhysicalReturnLabel: e.target.checked,
                  })
                }
              />
              <Label htmlFor="freePhysicalReturnLabel">
                Free Physical Return Label
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="freePhysicalReceipt"
                checked={formData.freePhysicalReceipt}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    freePhysicalReceipt: e.target.checked,
                  })
                }
              />
              <Label htmlFor="freePhysicalReceipt">
                Free Physical Receipt
              </Label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="w-[150px] border-red-300 text-red-600"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createPlan.isPending}
            className="w-[150px] bg-[#31B8FA] hover:bg-[#31B8FA]"
          >
            {createPlan.isPending ? "Creating..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSubscription;