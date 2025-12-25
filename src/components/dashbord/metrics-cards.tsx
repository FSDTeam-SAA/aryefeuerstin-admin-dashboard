"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useSession } from "next-auth/react";

export function MetricsCards() {
 const { data: session } = useSession();
   const TOKEN = session?.user?.accessToken;

  const { data: totalsData } = useQuery({
    queryKey: ["dashboard-totals"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/totals`,{
          method : "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch totals")
      return res.json()
    },
  })

  const { data: ordersData } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/return-orders`,{
          method : "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch orders")
      return res.json()
    },
  })

  const { data: revenueData } = useQuery({
    queryKey: ["dashboard-revenue"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/revenue`,{
          method : "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      if (!res.ok) throw new Error("Failed to fetch revenue")
      return res.json()
    },
  })

  /* ================= DEBUG (IMPORTANT) ================= */
  console.log("Totals API:", totalsData)
  console.log("Orders API:", ordersData)
  console.log("Revenue API:", revenueData)

  /* ================= SAFE DATA EXTRACTION ================= */

  const totalUsers =
    totalsData?.data?.totalUsers ??
    totalsData?.data?.users ??
    totalsData?.totalUsers ??
    0

  const totalDrivers =
    totalsData?.data?.totalApprovedDrivers ??
    totalsData?.data?.drivers ??
    totalsData?.totalDrivers ??
    0

  const totalOrders =
    ordersData?.data?.totalOrders ??
    ordersData?.data?.orders ??
    ordersData?.totalOrders ??
    0

  const totalRevenue =
    revenueData?.data?.summary?.totalRevenue ??
    revenueData?.data?.totalRevenue ??
    revenueData?.totalRevenue ??
    0

  /* ================= METRICS CONFIG ================= */

  const metrics = [
    {
      title: "Total Applications",
      value: totalDrivers,
      change: "+36%",
      isPositive: true,
    },
    {
      title: "Total Booking",
      value: totalOrders,
      change: "-14%",
      isPositive: false,
    },
    {
      title: "Total Earnings",
      value: `$${Number(totalRevenue).toLocaleString()}`,
      change: "+36%",
      isPositive: true,
    },
    {
      title: "Total Users",
      value: totalUsers,
      change: "+30%",
      isPositive: true,
    },
  ]

  /* ================= UI ================= */

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="border border-[#B6B6B6]">
          <CardHeader className="pb-5">
            <CardTitle className="text-base font-medium text-[#8C8F8C]">
              {metric.title}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-[36px] font-semibold text-[#131313]">
                {metric.value}
              </div>

              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {metric.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
