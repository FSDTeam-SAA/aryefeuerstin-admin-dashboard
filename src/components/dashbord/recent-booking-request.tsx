import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const bookings = [
  {
    id: 1,
    customer: "Olivia Rhye",
    email: "olivia@example.com",
    status: "Pending",
    statusColor: "bg-yellow-100 text-yellow-800",
    date: "Jan 6, 2022",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia1",
  },
  {
    id: 2,
    customer: "Olivia Rhye",
    email: "olivia@example.com",
    status: "Cancel",
    statusColor: "bg-red-100 text-red-800",
    date: "Jan 6, 2022",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia2",
  },
  {
    id: 3,
    customer: "Olivia Rhye",
    email: "olivia@example.com",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
    date: "Jan 6, 2022",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia3",
  },
  {
    id: 4,
    customer: "Olivia Rhye",
    email: "olivia@example.com",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
    date: "Jan 6, 2022",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia4",
  },
  {
    id: 5,
    customer: "Olivia Rhye",
    email: "olivia@example.com",
    status: "Completed",
    statusColor: "bg-green-100 text-green-800",
    date: "Jan 6, 2022",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia5",
  },
]

export function RecentBookingRequest() {
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-[18px] text-[#333733] font-semibold">Recent Booking Request</CardTitle>
          <CardDescription className="text-xs text-[#8C8F8C]">View the latest customer appointments and their current status.</CardDescription>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="border-b border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={booking.avatar || "/placeholder.svg"} alt={booking.customer} />
                        <AvatarFallback>{booking.customer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base text-[#333733] font-medium">{booking.customer}</p>
                        <p className="text-xs text-[#8C8F8C]">{booking.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.statusColor}`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{booking.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}