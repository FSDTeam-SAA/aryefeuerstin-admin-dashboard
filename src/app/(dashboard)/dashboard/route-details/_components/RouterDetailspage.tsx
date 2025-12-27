"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

function RouteDetailsPage() {
  const params = useParams();
  const driverId = params.id as string;

  const { data: session, status } = useSession();
  const TOKEN = session?.user?.accessToken;

  const routeMutation = useMutation({
    mutationFn: async () => {
      console.log("Sending payload:", { driverId });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/return-order/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // ✅ MUST
            Authorization: `Bearer ${TOKEN}`,   // ✅ TOKEN
          },
          body: JSON.stringify({
            driverId, // ✅ backend expects this
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Route generation failed");
      }

      return data;
    },
  });

  useEffect(() => {
    // ✅ wait for both driverId & TOKEN
    if (driverId && TOKEN) {
      routeMutation.mutate();
    }
  }, [driverId, TOKEN]);

  if (status === "loading" || routeMutation.isPending) {
    return <div className="p-6">Generating route...</div>;
  }

  if (routeMutation.isError) {
    return (
      <div className="p-6 text-red-500">
        {(routeMutation.error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Route Details</h1>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(routeMutation.data, null, 2)}
      </pre>
    </div>
  );
}

export default RouteDetailsPage;
