// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { format } from "date-fns";

// // Helper: Format minutes → "30h 29m" or "8h"
// const formatHours = (totalMinutes: number): string => {
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;
//   if (minutes === 0) return `${hours}h`;
//   return `${hours}h ${minutes}m`;
// };

// // Helper: Format "2025-12-27" → "27 Dec"
// const formatDisplayDate = (dateStr: string): string => {
//   const date = new Date(dateStr);
//   return format(date, "d MMM");
// };

// // Types based on your actual API response
// interface Session {
//   punchInAt: string;
//   punchOutAt: string;
//   totalMinutes: number;
// }

// interface WorkingHour {
//   driverName: string;
//   email: string;
//   profileImage: string;
//   date: string; // "2025-12-27"
//   startTime: string; // "6:37 AM"
//   endTime: string; // "2:41 PM"
//   hours: string;
//   totalMinutes: number;
//   sessions: Session[];
// }

// interface ApiResponse {
//   status: boolean;
//   message: string;
//   data: {
//     workingHours: WorkingHour[];
//     paginationInfo: {
//       currentPage: number;
//       totalPages: number;
//       totalRecords: number;
//       recordsPerPage: number;
//     };
//   };
// }

// const DriverWorkingHours = () => {
//   const { data: session } = useSession();
//   const token = (session?.user as { accessToken?: string })?.accessToken;

//   // Filter states
//   const [searchEmail, setSearchEmail] = useState("");
//   const [startDate, setStartDate] = useState("2025-12-27");
//   const [endDate, setEndDate] = useState("2025-12-27");

//   const { data, isLoading, error } = useQuery<ApiResponse>({
//     queryKey: ["driver-working-hours", startDate, endDate],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/driver-work-session/working-hours?startDate=${startDate}&endDate=${endDate}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch driver working hours");
//       }
//       return res.json();
//     },
//     enabled: !!token && !!startDate && !!endDate,
//   });

//   // Client-side search filter
//   const filteredData = data?.data.workingHours.filter((record) =>
//     record.email.toLowerCase().includes(searchEmail.toLowerCase())
//   ) || [];

//   const pagination = data?.data.paginationInfo;

//   if (isLoading) return <div className="p-8 text-center">Loading...</div>;
//   if (error) return <div className="p-8 text-center text-red-600">Error loading data</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="bg-white rounded-lg shadow">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
//           <h2 className="text-xl font-semibold">Driver Working Hour</h2>

//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             {/* Search by Email */}
//             <input
//               type="text"
//               placeholder="Search by Email"
//               value={searchEmail}
//               onChange={(e) => setSearchEmail(e.target.value)}
//               className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             {/* Date Range Picker */}
//             <div className="flex items-center gap-2">
//               <input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm"
//               />
//               <span className="text-gray-500">to</span>
//               <input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-md text-sm"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 text-sm font-medium text-gray-700">
//               <tr>
//                 <th className="p-4">Driver Name</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Date</th>
//                 <th className="p-4">Start Time</th>
//                 <th className="p-4">End Time</th>
//                 <th className="p-4">Hours</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center p-12 text-gray-500">
//                     {searchEmail || startDate !== endDate
//                       ? "No records match your search or date range"
//                       : "No working hours recorded"}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((record, index) => (
//                   <tr key={index} className="border-t hover:bg-gray-50">
//                     <td className="p-4">
//                       <div className="flex items-center gap-3">
//                         {record.profileImage ? (
//                           <Image
//                             src={record.profileImage}
//                             alt={record.driverName}
//                             width={40}
//                             height={40}
//                             className="rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
//                         )}
//                         <span className="font-medium">{record.driverName}</span>
//                       </div>
//                     </td>
//                     <td className="p-4 text-gray-600">{record.email}</td>
//                     <td className="p-4">{formatDisplayDate(record.date)}</td>
//                     <td className="p-4">{record.startTime}</td>
//                     <td className="p-4">{record.endTime}</td>
//                     <td className="p-4 font-medium text-blue-600">
//                       {formatHours(record.totalMinutes)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
//           <span>
//             Showing {filteredData.length} of {pagination?.totalRecords || 0} results
//             {searchEmail && " (filtered)"}
//           </span>

//           {/* Pagination (basic) */}
//           {pagination && pagination.totalPages > 1 && (
//             <div className="flex gap-2">
//               {Array.from({ length: pagination.totalPages }, (_, i) => (
//                 <button
//                   key={i + 1}
//                   className={`px-3 py-1 border rounded ${
//                     pagination.currentPage === i + 1
//                       ? "bg-orange-100 border-orange-500 text-orange-700"
//                       : "border-gray-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverWorkingHours;


"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { format } from "date-fns";

// Optional: Simple debounce hook (no external dependency)
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Helpers
const formatHours = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const formatDisplayDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return format(date, "d MMM");
};

// Types
interface Session {
  punchInAt: string;
  punchOutAt: string;
  totalMinutes: number;
}

interface WorkingHour {
  driverName: string;
  email: string;
  profileImage: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: string;
  totalMinutes: number;
  sessions: Session[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    workingHours: WorkingHour[];
    paginationInfo: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      recordsPerPage: number;
    };
  };
}

const DriverWorkingHours = () => {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;

  // Filter states
  const [searchEmail, setSearchEmail] = useState("");
  const debouncedSearchEmail = useDebounce(searchEmail, 500); // 500ms delay

  const [startDate, setStartDate] = useState("2025-12-27");
  const [endDate, setEndDate] = useState("2025-12-27");

  // Build API URL with all params
  const buildUrl = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (debouncedSearchEmail.trim()) {
      params.append("search", debouncedSearchEmail.trim());
    }
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/driver-work-session/working-hours?${params.toString()}`;
  };

  const { data, isLoading, error, isFetching } = useQuery<ApiResponse>({
    queryKey: ["driver-working-hours", startDate, endDate, debouncedSearchEmail],
    queryFn: async () => {
      const res = await fetch(buildUrl(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Failed to fetch: ${res.status} ${err}`);
      }
      return res.json();
    },
    enabled: !!token,
  
  });

  const workingHours = data?.data.workingHours || [];
  const pagination = data?.data.paginationInfo;

  const isSearching = isFetching && debouncedSearchEmail !== searchEmail;

  return (
    <div className=" bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
          <h2 className="text-xl font-semibold">Driver Working Hour</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {isSearching && (
                <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                  Searching...
                </span>
              )}
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <span className="text-gray-500 hidden sm:inline">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading working hours...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">
            Error loading data. Please try again.
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-sm font-medium text-gray-700">
                  <tr>
                    <th className="p-4">Driver Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Start Time</th>
                    <th className="p-4">End Time</th>
                    <th className="p-4">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {workingHours.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center p-12 text-gray-500">
                        {debouncedSearchEmail || startDate !== endDate
                          ? "No records found matching your filters"
                          : "No working hours recorded for selected date range"}
                      </td>
                    </tr>
                  ) : (
                    workingHours.map((record, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {record.profileImage ? (
                              <Image
                                src={record.profileImage}
                                alt={record.driverName}
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-300 rounded-full" />
                            )}
                            <span className="font-medium">{record.driverName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">{record.email}</td>
                        <td className="p-4">{formatDisplayDate(record.date)}</td>
                        <td className="p-4">{record.startTime}</td>
                        <td className="p-4">{record.endTime}</td>
                        <td className="p-4 font-medium text-blue-600">
                          {formatHours(record.totalMinutes)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t text-sm text-gray-600 gap-4">
              <span>
                Showing {workingHours.length} of {pagination?.totalRecords || 0} results
                {debouncedSearchEmail && " (filtered by email)"}
              </span>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`px-3 py-1 border rounded transition ${
                        pagination.currentPage === i + 1
                          ? "bg-orange-100 border-orange-500 text-orange-700"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DriverWorkingHours;