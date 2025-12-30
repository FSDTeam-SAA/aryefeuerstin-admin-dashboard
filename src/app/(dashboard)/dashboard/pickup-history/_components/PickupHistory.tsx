// "use client";

// import React, { useState } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { PickupHistoryModal } from "@/components/Modal/PickupHistoryModal";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";

// /* ================= TYPES ================= */

// interface PickupItem {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   pickupAddress: string;
//   pickupInstructions: string;
//   returnStore: string;
//   numberOfPackages: number;
//   status: string;
//   createdAt: string;
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
//   data: {
//     data: PickupItem[];
//     pagination: {
//       currentPage: number;
//       totalPages: number;
//       totalData: number;
//       hasNextPage: boolean;
//       hasPrevPage: boolean;
//     };
//   };
// }

// const RESULTS_PER_PAGE = 10;

// /* ================= COMPONENT ================= */

// const PickupHistory: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { data: session } = useSession();
//   const TOKEN = session?.user?.accessToken;

//   const { data, isLoading } = useQuery<ApiResponse>({
//     queryKey: ["pickup-history", currentPage],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/admin/pickup-history?status=COMPLETED&page=${currentPage}&limit=${RESULTS_PER_PAGE}`, {
//           method : "GET",
//           headers: {
//             Authorization: `Bearer ${TOKEN}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch pickup history");
//       return res.json();
//     },
//   });

//   const pickups = data?.data.data ?? [];
//   const pagination = data?.data.pagination;

//   const totalPages = Number(pagination?.totalPages || 1);
//   const hasNextPage = pagination?.hasNextPage;
//   const hasPrevPage = pagination?.hasPrevPage;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-900">
//           Pickup history
//         </h1>
//         <div className="flex items-center gap-2 mt-2 text-sm">
//           <span className="text-gray-500">Dashboard</span>
//           <span className="text-gray-500">{">"}</span>
//           <span className="text-gray-500">Pickup history</span>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-white border-b-2">
//               <TableHead className="font-semibold text-gray-900">Dealership Name</TableHead>
//               <TableHead className="font-semibold text-gray-900">Date</TableHead>
//               <TableHead className="font-semibold text-gray-900">Email</TableHead>
//               <TableHead className="font-semibold text-gray-900">Phone</TableHead>
//               <TableHead className="font-semibold text-gray-900">Pickup Address</TableHead>
//               <TableHead className="font-semibold text-gray-900">Return Store</TableHead>
//               <TableHead className="font-semibold text-gray-900">Packages</TableHead>
//               <TableHead className="text-right font-semibold text-gray-900">Action</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={8} className="text-center py-6">
//                   Loading pickup history...
//                 </TableCell>
//               </TableRow>
//             ) : pickups.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} className="text-center py-6">
//                   No pickup history found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               pickups.map((item) => (
//                 <TableRow key={item._id} className="border-b hover:bg-gray-50">
//                   {/* Name */}
//                   <TableCell>
//                     <div className="flex items-center gap-3 py-2">
//                       <Avatar className="h-10 w-10">
//                         <AvatarFallback className="bg-gray-200 text-gray-700">
//                           { item?.firstName[0]}{item?.lastName}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="font-medium text-gray-900">
//                         {item?.firstName} {item?.lastName}
//                       </span>
//                     </div>
//                   </TableCell>

//                   {/* Date */}
//                   <TableCell className="text-gray-700">
//                     {new Date(item?.createdAt).toLocaleDateString()}
//                   </TableCell>

//                   {/* Email */}
//                   <TableCell className="text-gray-700">{item?.email}</TableCell>

//                   {/* Phone */}
//                   <TableCell className="text-gray-700">{item?.phone}</TableCell>

//                   {/* Pickup Address */}
//                   <TableCell className="text-gray-700">{item?.pickupAddress}</TableCell>

//                   {/* Return Store */}
//                   <TableCell className="text-gray-700">{item?.returnStore}</TableCell>

//                   {/* Packages */}
//                   <TableCell className="text-gray-700">{item?.numberOfPackages}</TableCell>

//                   {/* Action */}
//                   <TableCell>
//                     <div className="flex justify-end items-center gap-2">
//                       <Badge className="bg-green-500 hover:bg-green-600 text-white px-4 py-1">
//                         {item?.status}
//                       </Badge>

//                       {/* Only View Button */}
//                       <PickupHistoryModal pickupId={item?._id} />
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>

//         {/* Pagination */}
//         {pagination && (
//           <div className="flex items-center justify-between px-6 py-4 border-t">
//             <p className="text-sm text-gray-600">
//               Page {currentPage} of {totalPages}
//             </p>

//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-9 w-9 border-gray-300"
//                 disabled={!hasPrevPage}
//                 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <Button
//                   key={page}
//                   size="sm"
//                   variant={currentPage === page ? "default" : "outline"}
//                   className={
//                     currentPage === page
//                       ? "bg-blue-500 hover:bg-blue-600 text-white h-9 min-w-9"
//                       : "border-gray-300 h-9 min-w-9"
//                   }
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </Button>
//               ))}

//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="h-9 w-9 border-gray-300"
//                 disabled={!hasNextPage}
//                 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PickupHistory;


"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PickupHistoryModal } from "@/components/Modal/PickupHistoryModal";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

/* ================= TYPES ================= */

interface StoreItem {
  store: string;
  numberOfPackages: number;
}

interface PickupItem {
  _id: string;

  // NEW FORMAT
  customer?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    pickupLocation?: {
      address?: string;
    };
  };

  stores?: StoreItem[];

  // OLD FORMAT
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  pickupAddress?: string;
  returnStore?: string;
  numberOfPackages?: number;

  status: string;
  createdAt: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    data: PickupItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalData: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

const RESULTS_PER_PAGE = 10;

/* ================= HELPERS ================= */

const getName = (item: PickupItem) =>
  item.customer
    ? `${item.customer.firstName ?? ""} ${item.customer.lastName ?? ""}`
    : `${item.firstName ?? ""} ${item.lastName ?? ""}`;

const getEmail = (item: PickupItem) =>
  item.customer?.email ?? item.email ?? "N/A";

const getPhone = (item: PickupItem) =>
  item.customer?.phone ?? item.phone ?? "N/A";

const getPickupAddress = (item: PickupItem) =>
  item.customer?.pickupLocation?.address ??
  item.pickupAddress ??
  "N/A";

const getReturnStore = (item: PickupItem) =>
  item.stores?.map((s) => s.store).join(", ") ??
  item.returnStore ??
  "N/A";

const getTotalPackages = (item: PickupItem) =>
  item.stores?.reduce((sum, s) => sum + s.numberOfPackages, 0) ??
  item.numberOfPackages ??
  0;

/* ================= COMPONENT ================= */

const PickupHistory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["pickup-history", currentPage],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/admin/pickup-history?status=COMPLETED&page=${currentPage}&limit=${RESULTS_PER_PAGE}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch pickup history");
      return res.json();
    },
  });

  const pickups = data?.data.data ?? [];
  const pagination = data?.data.pagination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Pickup History</h1>
        <p className="text-sm text-gray-500 mt-1">
          Dashboard &gt; Pickup history
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Pickup Address</TableHead>
              <TableHead>Return Store</TableHead>
              <TableHead>Packages</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : pickups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No pickup history found
                </TableCell>
              </TableRow>
            ) : (
              pickups.map((item) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  {/* Name */}
                  <TableCell>
                    <div className="flex items-center gap-3 py-2">
                      <Avatar>
                        <AvatarFallback>
                          {getName(item)[0] ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {getName(item)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>

                  {/* Email */}
                  <TableCell>{getEmail(item)}</TableCell>

                  {/* Phone */}
                  <TableCell>{getPhone(item)}</TableCell>

                  {/* Pickup Address */}
                  <TableCell className="max-w-[220px] truncate">
                    {getPickupAddress(item)}
                  </TableCell>

                  {/* Return Store */}
                  <TableCell>{getReturnStore(item)}</TableCell>

                  {/* Packages */}
                  <TableCell>{getTotalPackages(item)}</TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Badge className="bg-green-500 text-white">
                        {item.status}
                      </Badge>
                      <PickupHistoryModal pickupId={item._id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <span className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                disabled={!pagination.hasPrevPage}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft />
              </Button>

              <Button
                size="icon"
                variant="outline"
                disabled={!pagination.hasNextPage}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupHistory;
