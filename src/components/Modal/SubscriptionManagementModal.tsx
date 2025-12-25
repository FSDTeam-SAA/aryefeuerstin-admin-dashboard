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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit, } from "lucide-react";

interface SubscriptionManagementModalProps {
  plan: {
    _id: string;
    title: string;
    price: number;
    billingCycle: string;
    status: string;
    features: string[];
  };
  token: string;

}

export function SubscriptionManagementModal({ plan,token }: SubscriptionManagementModalProps) {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(plan.title);
  const [price, setPrice] = useState(String(plan.price));
  const [billingCycle, setBillingCycle] = useState(plan.billingCycle);
  const [features, setFeatures] = useState<string[]>([...plan.features]);
  const [featureInput, setFeatureInput] = useState("");

  // ➕ Add feature
  const addFeature = () => {
    if (!featureInput.trim()) return;
    if (features.includes(featureInput.trim())) {
      toast.error("Feature already added");
      return;
    }
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  };

  // ❌ Remove feature
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // ✅ Update mutation
  const { mutate: updatePlan, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plan/${plan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, price: Number(price), billingCycle, features }),
      });
      if (!res.ok) throw new Error("Failed to update plan");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscription plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => {
      toast.error("Failed to update subscription plan");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlan();
  };

  const handleCancel = () => {
    setTitle(plan.title);
    setPrice(String(plan.price));
    setBillingCycle(plan.billingCycle);
    setFeatures([...plan.features]);
    setFeatureInput("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Plan Title */}
          <div className="grid gap-2">
            <Label>Plan Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label>Price ($)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>

          {/* Billing Cycle */}
          <div className="grid gap-2">
            <Label>Billing Cycle</Label>
            <Select value={billingCycle} onValueChange={(value) => setBillingCycle(value)}>
              <SelectTrigger className="h-[45px] bg-white">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status (read-only) */}
          <div className="grid gap-2">
            <Label>Status</Label>
            <Badge className={plan.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
              {plan.status}
            </Badge>
          </div>

          {/* Features */}
          <div className="grid gap-2">
            <Label>Features</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type feature and click +"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFeature()}
                className="h-[45px] bg-white"
              />
              <Button type="button" onClick={addFeature} className="px-5">
                +
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {features.map((feature, index) => (
                <span key={index} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)} className="text-red-500 font-bold">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
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
