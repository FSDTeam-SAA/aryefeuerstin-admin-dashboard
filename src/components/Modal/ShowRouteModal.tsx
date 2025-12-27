"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { CheckCircle2, User, Package, MapPin } from "lucide-react";

interface AssignedDriver {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Order {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  stores: Array<{
    store: string;
    numberOfPackages: number;
  }>;
  assignmentStatus: string;
}

interface ApiResponseData {
  assignedDriver: AssignedDriver;
  orders: Order[];
  matchedOrders: number;
  modifiedCount: number;
}

interface ShowRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  responseData?: ApiResponseData;
}

export function ShowRouteModal({
  isOpen,
  onClose,
  responseData,
}: ShowRouteModalProps) {
  const router = useRouter();

  if (!responseData) return null;

  const { assignedDriver, orders, matchedOrders } = responseData;

  const handleViewRoute = () => {
    if (!assignedDriver?.id) return;

    router.push(`/dashboard/route-details/${assignedDriver.id}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Success Header */}
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold text-green-600">
            Driver Assigned Successfully!
          </DialogTitle>
        </DialogHeader>

        {/* Driver Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Assigned Driver
            </h3>
          </div>
          <div className="space-y-2 ml-13">
            <p className="text-gray-900 font-medium text-lg">
              {assignedDriver.name}
            </p>
            <p className="text-gray-600 text-sm">
              📧 {assignedDriver.email}
            </p>
            <p className="text-gray-600 text-sm">
              📱 {assignedDriver.phone}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-gray-600">
                Total Orders
              </p>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {matchedOrders}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <p className="text-sm font-medium text-gray-600">
                Customers
              </p>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {orders.length}
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            Assigned Orders
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                        #{index + 1}
                      </span>
                      <p className="font-medium text-gray-900">
                        {order.customer.firstName}{" "}
                        {order.customer.lastName}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      📱 {order.customer.phone}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {order.stores.map((store, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium"
                        >
                          {store.store} • {store.numberOfPackages} pkg
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
                    {order.assignmentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Close
          </Button>
          <Button
            onClick={handleViewRoute}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            <MapPin className="w-4 h-4 mr-2" />
            View Route
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
