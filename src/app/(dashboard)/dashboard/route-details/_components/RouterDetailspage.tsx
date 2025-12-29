/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams } from "next/navigation";
import { useGoogleMaps } from "@/hooks/useGoogleMape";
import GoogleMap from "@/components/dashbord/GoogleMap";

function RouteDetailsPage() {
  const params = useParams();
  const driverId = params.id as string;

  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useGoogleMaps();

  // Demo locations for testing - Replace with your actual data
  const locations = [
    {
      lat: 23.8103,
      lng: 90.4125,
      label: "Dhaka - Start Point"
    },
    {
      lat: 23.8223,
      lng: 90.4256,
      label: "Stop 1 - Gulshan"
    },
    {
      lat: 23.7808,
      lng: 90.4219,
      label: "Stop 2 - Banani"
    },
    {
      lat: 23.7515,
      lng: 90.3773,
      label: "Stop 3 - Dhanmondi"
    },
    {
      lat: 23.7269,
      lng: 90.3992,
      label: "End Point - Mirpur"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Route Details - Driver {driverId}
      </h1>

      {mapLoadError && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">{mapLoadError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Route Map</h2>
          {!isMapLoaded ? (
            <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          ) : locations.length > 0 ? (
            <GoogleMap locations={locations} />
          ) : (
            <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No locations to display</p>
            </div>
          )}
        </div>

        {/* Route Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Route Information</h2>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Driver ID</p>
              <p className="font-semibold">{driverId}</p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Stops</p>
              <p className="font-semibold">{locations.length}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Stop Details</h3>
              <div className="space-y-2 max-h-[400px] overflow-auto">
                {locations.map((location, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{location.label}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteDetailsPage;