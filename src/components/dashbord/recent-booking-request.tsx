"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

interface Booking {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      zipCode: string;
      street: string;
      city: string;
    };
  };
  status: string;
  createdAt: string;
  pricing: {
    baseAmount: number;
    extraFees: number;
    totalAmount: number;
  };
}

export function RecentBookingRequest() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recentOrder"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/return-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch return orders");
      const json = await res.json();
      return json.data.recentOrders as Booking[];
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load bookings.</p>;

  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-[18px] text-[#333733] font-semibold">
            Recent Booking Request
          </CardTitle>
          <CardDescription className="text-xs text-[#8C8F8C]">
            View the latest customer appointments and their current status.
          </CardDescription>
        </div>
        <Button variant="link" size="sm" className="text-[#064420]">
          See all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-[#F8F8FF] bg-[#F8F8FF]">
                <TableHead className="font-medium">Customer</TableHead>
                <TableHead className="font-medium">Status</TableHead>
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Total Amount</TableHead> {/* নতুন */}
                <TableHead className="font-medium text-center">Address</TableHead> {/* নতুন */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                ?.sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .map((booking) => (
                  <TableRow key={booking._id} className="border-b border-border hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt={booking.customer.firstName} />
                          <AvatarFallback>
                            {booking.customer.firstName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-base text-[#333733] font-medium">
                            {booking.customer.firstName} {booking.customer.lastName}
                          </p>
                          <p className="text-xs text-[#8C8F8C]">{booking.customer.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      ${booking.pricing.totalAmount}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground text-center">
                      {booking.customer.address.street}, {booking.customer.address.city}, {booking.customer.address.zipCode}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
