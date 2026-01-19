/* eslint-disable @typescript-eslint/no-explicit-any */
// // "use client";

// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Dialog,
// //   DialogClose,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Badge } from "@/components/ui/badge";
// // import { Eye } from "lucide-react";
// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import { toast } from "sonner";

// // interface SubscriptionManagementModalProps {
// //   plan: {
// //     _id: string;
// //     title: string;
// //     price: number;
// //     billingCycle: string;
// //     status: string;
// //     features: string[];
// //   };
// // }

// // export function SubscriptionManagementModal({
// //   plan,
// // }: SubscriptionManagementModalProps) {
// //   const queryClient = useQueryClient();

// //   const [title, setTitle] = useState(plan.title);
// //   const [price, setPrice] = useState(plan.price);
// //   const [billingCycle, setBillingCycle] = useState(plan.billingCycle);

// //   // ✅ Update mutation
// //   const { mutate: updatePlan, isPending } = useMutation({
// //     mutationFn: async () => {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/${plan._id}`,
// //         {
// //           method: "PUT",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             title,
// //             price,
// //             billingCycle,
// //           }),
// //         }
// //       );

// //       if (!res.ok) throw new Error("Failed to update plan");
// //       return res.json();
// //     },
// //     onSuccess: () => {
// //       toast.success("Subscription plan updated successfully");
// //       queryClient.invalidateQueries({ queryKey: ["plans"] });
// //     },
// //     onError: () => {
// //       toast.error("Failed to update subscription plan");
// //     },
// //   });

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     updatePlan();
// //   };

// //   return (
// //     <Dialog>
// //       <DialogTrigger asChild>
// //         <Button variant="outline" size="icon">
// //           <Eye className="h-4 w-4" />
// //         </Button>
// //       </DialogTrigger>

// //       <DialogContent className="sm:max-w-[500px]">
// //         <DialogHeader>
// //           <DialogTitle>Subscription Details</DialogTitle>
// //           <DialogDescription>
// //             View and update subscription plan information.
// //           </DialogDescription>
// //         </DialogHeader>

// //         {/* Form */}
// //         <form className="grid gap-4" onSubmit={handleSubmit}>
// //           {/* Plan Title */}
// //           <div className="grid gap-2">
// //             <Label>Plan Title</Label>
// //             <Input value={title} onChange={(e) => setTitle(e.target.value)} />
// //           </div>

// //           {/* Price */}
// //           <div className="grid gap-2">
// //             <Label>Price ($)</Label>
// //             <Input
// //               type="number"
// //               value={price}
// //               onChange={(e) => setPrice(Number(e.target.value))}
// //             />
// //           </div>

// //           {/* Billing Cycle */}
// //           <div className="grid gap-2">
// //             <Label>Billing Cycle</Label>
// //             <Input
// //               value={billingCycle}
// //               className="capitalize"
// //               onChange={(e) => setBillingCycle(e.target.value)}
// //             />
// //           </div>

// //           {/* Status (read-only) */}
// //           <div className="grid gap-2">
// //             <Label>Status</Label>
// //             <div>
// //               <Badge
// //                 className={
// //                   plan.status === "active"
// //                     ? "bg-green-100 text-green-700"
// //                     : "bg-red-100 text-red-700"
// //                 }
// //               >
// //                 {plan.status}
// //               </Badge>
// //             </div>
// //           </div>

// //           {/* Features (read-only) */}
// //           <div className="grid gap-2">
// //             <Label>Features</Label>
// //             <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
// //               {plan.features.map((feature, index) => (
// //                 <li key={index}>{feature}</li>
// //               ))}
// //             </ul>
// //           </div>

// //           {/* Footer */}
// //           <DialogFooter className="mt-4">
// //             <DialogClose asChild>
// //               <Button variant="outline">Cancel</Button>
// //             </DialogClose>
// //             <Button type="submit" disabled={isPending}>
// //               {isPending ? "Saving..." : "Save Changes"}
// //             </Button>
// //           </DialogFooter>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }



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
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { Badge } from "lucide-react";

// interface EditSubscriptionPageProps {
//   plan: {
//     _id: string;
//     title: string;
//     price: number;
//     billingCycle: string;
//     status: string;
//     features: string[];
//   };
// }

// const EditSubscriptionPage: React.FC<EditSubscriptionPageProps> = ({
//   plan,

// }) => {
//   const queryClient = useQueryClient();

//   const [title, setTitle] = useState(plan.title);
//   const [price, setPrice] = useState(String(plan.price));
//   const [billingCycle, setBillingCycle] = useState(plan.billingCycle);
//   const [features, setFeatures] = useState<string[]>([...plan.features]);
//   const [featureInput, setFeatureInput] = useState("");

//   // ➕ Add feature
//   const addFeature = () => {
//     if (!featureInput.trim()) return;
//     if (features.includes(featureInput.trim())) {
//       toast.error("Feature already added");
//       return;
//     }
//     setFeatures([...features, featureInput.trim()]);
//     setFeatureInput("");
//   };

//   // ❌ Remove feature
//   const removeFeature = (index: number) => {
//     setFeatures(features.filter((_, i) => i !== index));
//   };

//   // ✅ Update mutation
//   const { mutate: updatePlan, isPending } = useMutation({
//     mutationFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/${plan._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
           
//           },
//           body: JSON.stringify({
//             title,
//             price: Number(price),
//             billingCycle,
//             features,
//           }),
//         }
//       );
//       if (!res.ok) throw new Error("Failed to update plan");
//       return res.json();
//     },
//     onSuccess: () => {
//       toast.success("Subscription plan updated successfully");
//       queryClient.invalidateQueries({ queryKey: ["plans"] });
//     },
//     onError: () => {
//       toast.error("Failed to update subscription plan");
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     updatePlan();
//   };

//   const handleCancel = () => {
//     setTitle(plan.title);
//     setPrice(String(plan.price));
//     setBillingCycle(plan.billingCycle);
//     setFeatures([...plan.features]);
//     setFeatureInput("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Edit Subscription
//         </h1>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Plan Title & Price */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label>Plan Title</Label>
//             <Input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               className="h-[45px] bg-white"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label>Price ($)</Label>
//             <Input
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="h-[45px] bg-white"
//             />
//           </div>
//         </div>

//         {/* Billing Cycle & Status */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="space-y-2">
//             <Label>Billing Cycle</Label>
//             <Select
//               value={billingCycle}
//               onValueChange={(value) => setBillingCycle(value)}
//             >
//               <SelectTrigger className="h-[45px] bg-white">
//                 <SelectValue placeholder="Select cycle" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="monthly">Monthly</SelectItem>
//                 <SelectItem value="basic">Basic</SelectItem>
//                 <SelectItem value="yearly">Yearly</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label>Status (read-only)</Label>
//             <div>
//               <Badge
//                 className={
//                   plan.status === "active"
//                     ? "bg-green-100 text-green-700"
//                     : "bg-red-100 text-red-700"
//                 }
//               >
//                 {plan.status}
//               </Badge>
//             </div>
//           </div>
//         </div>

//         {/* Features */}
//         <div className="space-y-2">
//           <Label>Features</Label>

//           <div className="flex gap-2">
//             <Input
//               placeholder="Type feature and click +"
//               value={featureInput}
//               onChange={(e) => setFeatureInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && addFeature()}
//               className="h-[45px] bg-white"
//             />
//             <Button type="button" onClick={addFeature} className="px-5">
//               +
//             </Button>
//           </div>

//           <div className="flex flex-wrap gap-2 mt-3">
//             {features.map((feature, index) => (
//               <span
//                 key={index}
//                 className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
//               >
//                 {feature}
//                 <button
//                   type="button"
//                   onClick={() => removeFeature(index)}
//                   className="text-red-500 font-bold"
//                 >
//                   ×
//                 </button>
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end gap-3 pt-4">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleCancel}
//             className="w-[150px] border-red-300 text-red-600"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             className="w-[150px] bg-[#31B8FA] hover:bg-[#31B8FA]"
//             disabled={isPending}
//           >
//             {isPending ? "Saving..." : "Save Changes"}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default EditSubscriptionPage;


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit } from "lucide-react";

interface SubscriptionManagementModalProps {
  plan: {
    _id: string;
    name: string;
    title: string;
    price: number;
    billingCycle: string;
    status: string;
    displayFeatures: string[];  // API response-এর সাথে মিলছে
    numberOfPackages?: number;
    limits?: { maxReturnOrders?: number | null };
    entitlements?: {
      rushService?: boolean;
      freePhysicalReturnLabel?: boolean;
      freePhysicalReceipt?: boolean;
    };
  };
  token: string;
}

export function SubscriptionManagementModal({
  plan,
  token,
}: SubscriptionManagementModalProps) {
  const queryClient = useQueryClient();

  const [name, setName] = useState(plan.name || "");
  const [title, setTitle] = useState(plan.title);
  const [price, setPrice] = useState(String(plan.price));
  const [billingCycle, setBillingCycle] = useState(plan.billingCycle);

  // Fixed: Safe initialization — undefined/null হলে খালি array
  const [displayFeatures, setDisplayFeatures] = useState<string[]>(
    Array.isArray(plan.displayFeatures) ? [...plan.displayFeatures] : []
  );

  const [featureInput, setFeatureInput] = useState("");
  const [numberOfPackages, setNumberOfPackages] = useState(
    String(plan.numberOfPackages ?? 0)
  );
  const [maxReturnOrders, setMaxReturnOrders] = useState(
    String(plan.limits?.maxReturnOrders ?? "")
  );
  const [rushService, setRushService] = useState(
    plan.entitlements?.rushService ?? false
  );
  const [freePhysicalReturnLabel, setFreePhysicalReturnLabel] = useState(
    plan.entitlements?.freePhysicalReturnLabel ?? false
  );
  const [freePhysicalReceipt, setFreePhysicalReceipt] = useState(
    plan.entitlements?.freePhysicalReceipt ?? false
  );

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    if (displayFeatures.includes(trimmed)) {
      toast.error("This feature is already added");
      return;
    }
    setDisplayFeatures([...displayFeatures, trimmed]);
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setDisplayFeatures(displayFeatures.filter((_, i) => i !== index));
  };

  const { mutate: updatePlan, isPending } = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: name.trim(),
        title: title.trim(),
        price: Number(price),
        billingCycle,
        displayFeatures,  // API-এর সাথে মিলছে
        numberOfPackages: Number(numberOfPackages) || 0,
        limits: {
          maxReturnOrders: maxReturnOrders ? Number(maxReturnOrders) : null,
        },
        entitlements: {
          rushService,
          freePhysicalReturnLabel,
          freePhysicalReceipt,
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/${plan._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update plan");
      }

      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscription plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update subscription plan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Plan title is required");
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    updatePlan();
  };

  const handleCancel = () => {
    setName(plan.name || "");
    setTitle(plan.title);
    setPrice(String(plan.price));
    setBillingCycle(plan.billingCycle);
    
    // Fixed: Safe reset
    setDisplayFeatures(
      Array.isArray(plan.displayFeatures) ? [...plan.displayFeatures] : []
    );

    setNumberOfPackages(String(plan.numberOfPackages ?? 0));
    setMaxReturnOrders(String(plan.limits?.maxReturnOrders ?? ""));
    setRushService(plan.entitlements?.rushService ?? false);
    setFreePhysicalReturnLabel(
      plan.entitlements?.freePhysicalReturnLabel ?? false
    );
    setFreePhysicalReceipt(plan.entitlements?.freePhysicalReceipt ?? false);
    setFeatureInput("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription Plan</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Name & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Plan Name (unique)</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="PAY_PER_PICKUP"
              />
            </div>
            <div className="grid gap-2">
              <Label>Display Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Price & Billing Cycle */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Price ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Billing Cycle</Label>
              <Select value={billingCycle} onValueChange={setBillingCycle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Packages & Max Returns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Allowed Packages</Label>
              <Input
                type="number"
                min="0"
                value={numberOfPackages}
                onChange={(e) => setNumberOfPackages(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Max Return Orders (0 = unlimited)</Label>
              <Input
                type="number"
                min="0"
                value={maxReturnOrders}
                onChange={(e) => setMaxReturnOrders(e.target.value)}
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type feature and press Enter"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
              />
              <Button type="button" onClick={addFeature}>
                +
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {displayFeatures.map((feature, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Entitlements */}
          <div className="grid gap-4">
            <Label>Entitlements</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rushService}
                  onChange={(e) => setRushService(e.target.checked)}
                />
                <span>Rush Service</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={freePhysicalReturnLabel}
                  onChange={(e) =>
                    setFreePhysicalReturnLabel(e.target.checked)
                  }
                />
                <span>Free Physical Return Label</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={freePhysicalReceipt}
                  onChange={(e) => setFreePhysicalReceipt(e.target.checked)}
                />
                <span>Free Physical Receipt</span>
              </label>
            </div>
          </div>

          {/* Status (read only) */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Badge
              className={
                plan.status === "active"
                  ? "bg-green-100 text-green-700 w-fit"
                  : "bg-red-100 text-red-700 w-fit"
              }
            >
              {plan.status}
            </Badge>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}