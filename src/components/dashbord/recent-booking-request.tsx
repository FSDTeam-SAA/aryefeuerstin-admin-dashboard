"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  Eye,
  Loader2,
  AlertCircle 
} from "lucide-react";

interface Address {
  zipCode: string;
  street: string;
  city: string;
}

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: Address;
  pickupInstructions?: string;
  pickupLocation?: {
    address: string;
    lat: number;
    lng: number;
  };
}

interface Pricing {
  baseAmount: number;
  extraFees: number;
  totalAmount: number;
}

interface Store {
  store: string;
  numberOfPackages: number;
}

interface ReturnOrder {
  _id: string;
  customer: Customer;
  status: string;
  createdAt: string;
  pricing: Pricing;
  stores: Store[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    totalOrders: number;
    items: ReturnOrder[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export function RecentBookingRequest() {
  const { data: session } = useSession();
  const TOKEN = session?.user?.accessToken;

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ["recentReturnOrders"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/return-orders?page=1&limit=6`, // ✅ Changed to 6
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch return orders");
      return res.json();
    },
    enabled: !!TOKEN,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "COMPLETED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card className="border border-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading return orders...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border border-border">
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm font-medium">Failed to load return orders</p>
            <p className="text-xs text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const orders = data?.data?.items || [];
  const totalOrders = data?.data?.totalOrders || 0;

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold text-[#333733] flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Recent Return Orders
          </CardTitle>
          <CardDescription className="text-sm text-[#8C8F8C]">
            Showing latest 6 of {totalOrders} total orders
          </CardDescription>
        </div>
        <Link href="/dashboard/return-orders">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View All
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F8FF] hover:bg-[#F8F8FF]">
                <TableHead className="font-semibold text-[#333733]">Customer</TableHead>
                <TableHead className="font-semibold text-[#333733]">Pickup Location</TableHead>
                <TableHead className="font-semibold text-[#333733]">Stores</TableHead>
                <TableHead className="font-semibold text-[#333733]">Status</TableHead>
                <TableHead className="font-semibold text-[#333733]">Date</TableHead>
                <TableHead className="font-semibold text-[#333733] text-right">Amount</TableHead>
                <TableHead className="font-semibold text-[#333733] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No return orders found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders
                  .sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )
                  .map((order) => (
                    <TableRow 
                      key={order._id} 
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      {/* Customer Info */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarImage 
                              src={`https://ui-avatars.com/api/?name=${order.customer.firstName}+${order.customer.lastName}&background=random`} 
                              alt={order.customer.firstName} 
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {order.customer.firstName.charAt(0)}
                              {order.customer.lastName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-[#333733]">
                              {order.customer.firstName} {order.customer.lastName}
                            </p>
                            <p className="text-xs text-[#8C8F8C]">{order.customer.email}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Pickup Location */}
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-[#333733] line-clamp-1">
                              {order.customer.pickupLocation?.address || 
                               `${order.customer.address.street}, ${order.customer.address.city}`}
                            </p>
                            <p className="text-xs text-[#8C8F8C]">
                              {order.customer.address.zipCode}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Stores */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {order.stores.map((store, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs font-medium"
                            >
                              {store.store} ({store.numberOfPackages})
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-[#333733]">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-[#333733]">
                            {order.pricing.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-center">
                        <Link href={`/dashboard/return-orders/${order._id}`}>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        {data?.data?.pagination && orders.length > 0 && (
          <div className="border-t p-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing latest 6 orders
            </p>
            <Link href="/dashboard/return-orders">
              <Button variant="outline" size="sm">
                View All {totalOrders} Orders →
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}