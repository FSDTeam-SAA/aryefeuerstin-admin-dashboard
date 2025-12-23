"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartData = [
    { month: "Feb", value: 35 },
    { month: "Mar", value: 38 },
    { month: "Apr", value: 32 }, 
    { month: "May", value: 50 },
    { month: "Jun", value: 42 },
    { month: "Jul", value: 50 },
    { month: "Aug", value: 30 },
    { month: "Sep", value: 50 },
    { month: "Oct", value: 30 },
    { month: "Nov", value: 52 },
    { month: "Dec", value: 40 },
    { month: "Jan", value: 58 },
]



export function EarningsOverview() {
    return (
        <Card
            className=" rounded-xl p-[1px]"

        >
            <div className="rounded-xl bg-white"> {/* Inner White Background */}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-[18px] font-semibold text-[#333733]">Earnings Overview</CardTitle>
                        <CardDescription className="text-[12px] text-[#8C8F8C]">Track total revenue, platform commission, and payouts over time.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Monthly</Button>
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

                                    {/* GOLD GRADIENT FILL FOR CHART */}
                                    <defs>
                                        <linearGradient id="gold-gradient" gradientTransform="rotate(357.59)">
                                            <stop offset="1.67%" stopColor="#FFE6BD" />
                                            <stop offset="58.18%" stopColor="#9D6507" />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                                    {/* MONTH LABELS WORKING */}
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

                    </div>
                </CardContent>
            </div>
        </Card>
    )
}