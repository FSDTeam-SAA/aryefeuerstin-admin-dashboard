import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function MetricsCards() {
  const metrics = [
    {
      title: "Total Applications",
      value: "12,426",
      change: "+36%",
      isPositive: true,
    },
    {
      title: "Total Booking",
      value: "12,426",
      change: "-14%",
      isPositive: false,
    },
    {
      title: "Total Earnings",
      value: "$12,426",
      change: "+36%",
      isPositive: true,
    },
    {
      title: "Total Users",
      value: "12,426",
      change: "+30%",
      isPositive: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
      {metrics.map((metric, index) => (
        <Card key={index} className="border border-[#B6B6B6]">
          <CardHeader className="pb-5">
            <CardTitle className="text-base font-medium text-[#8C8F8C]">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-[36px] font-semibold text-[#131313]">{metric.value}</div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {metric.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}