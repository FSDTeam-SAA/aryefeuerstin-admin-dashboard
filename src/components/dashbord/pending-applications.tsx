"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

/* ================= TYPES ================= */

interface Driver {
  _id: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  driverRequestStatus: "PENDING" | "APPROVED" | "REJECTED"
}

interface PendingDriverResponse {
  status: boolean
  message: string
  data: {
    drivers: Driver[]
    paginationInfo: {
      currentPage: number
      totalPages: number
      totalData: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
}

export function PendingApplications() {
  const { data: session } = useSession();
       const TOKEN = session?.user?.accessToken;
  /* -------------------- API -------------------- */
  const { data, isLoading } = useQuery<PendingDriverResponse>({
    queryKey: ["pendingOrder"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/driver-requests?status=PENDING`,{
          method : "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      )
      if (!res.ok) {
        throw new Error("Failed to fetch pending drivers")
      }
      return res.json()
    },
  })

  const drivers = data?.data?.drivers ?? []

  /* -------------------- UI -------------------- */
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-[18px] text-[#333733] font-semibold">
            Pending Applications
          </CardTitle>
          <CardDescription className="text-xs text-[#8C8F8C]">
            Approve pending professional profiles.
          </CardDescription>
        </div>
        <Button variant="link" size="sm" className="text-[#064420]">
          See all
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* LOADING */}
          {isLoading && (
            <p className="text-sm text-center text-muted-foreground">
              Loading pending applications...
            </p>
          )}

          {/* EMPTY */}
          {!isLoading && drivers.length === 0 && (
            <p className="text-sm text-center text-muted-foreground">
              No pending applications found
            </p>
          )}

          {/* DATA */}
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={driver.profileImage || ""}
                    alt={`${driver.firstName} ${driver.lastName}`}
                  />
                  <AvatarFallback>
                    {driver.firstName?.[0]}
                    {driver.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-base text-[#333733] font-medium">
                    {driver.firstName} {driver.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {driver.email}
                  </p>
                </div>
              </div>

              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
