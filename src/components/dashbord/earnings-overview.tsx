"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import { useState, useMemo } from "react"
import { useSession } from "next-auth/react"

/* ================= TYPES ================= */

interface GrowthItem {
  month: string
  revenue: number
}

interface GrowthResponse {
  status: boolean
  message: string
  data: {
    year: number
    items: GrowthItem[]
  }
}

interface ChartItem {
  month: string
  value: number
}

export function EarningsOverview() {
  /* -------------------- STATE -------------------- */
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState<string>(String(currentYear))
  const { data: session } = useSession();
     const TOKEN = session?.user?.accessToken;

  /* -------------------- DYNAMIC YEARS -------------------- */
  const years = useMemo(() => {
    // previous 3 years + current year + next 1 year
    return Array.from({ length: 5 }, (_, i) =>
      String(currentYear - 3 + i)
    )
  }, [currentYear])

  /* -------------------- API -------------------- */
  const { data: growthData, isLoading } = useQuery<GrowthResponse>({
    queryKey: ["growth", year],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/growth?year=${year}`,{
            method : "GET",
            headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      if (!res.ok) {
        throw new Error("Failed to fetch growth data")
      }
      return res.json()
    },
  })

  /* -------------------- DATA MAPPING -------------------- */
  const chartData: ChartItem[] =
    growthData?.data?.items?.map((item) => ({
      month: item.month,
      value: item.revenue,
    })) ?? []

  /* -------------------- UI -------------------- */
  return (
    <Card className="rounded-xl p-[1px]">
      <div className="rounded-xl bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-[18px] font-semibold text-[#333733]">
              Earnings Overview
            </CardTitle>
            <CardDescription className="text-[12px] text-[#8C8F8C]">
              Track total revenue, platform commission, and payouts over time.
            </CardDescription>
          </div>

          {/* 🔥 DYNAMIC YEAR SELECT */}
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="mt-6">
            <ChartContainer
              config={{
                value: {
                  label: "Earnings",
                  color: "#9D6507",
                },
              }}
              className="h-[360px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="gold-gradient"
                      gradientTransform="rotate(357.59)"
                    >
                      <stop offset="1.67%" stopColor="#FFE6BD" />
                      <stop offset="58.18%" stopColor="#9D6507" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="month"
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: "12px" }}
                  />

                  <Tooltip content={<ChartTooltipContent />} />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#12382B"
                    fill="url(#gold-gradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {isLoading && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Loading chart data...
              </p>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
