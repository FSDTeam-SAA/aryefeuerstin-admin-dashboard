import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical } from "lucide-react"

const payments = [
  {
    id: 1,
    customer: "Cameron Williamso",
    role: "Product Designer",
    amount: "$20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron1",
  },
  {
    id: 2,
    customer: "Cameron Williamso",
    role: "Product Designer",
    amount: "$20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron2",
  },
  {
    id: 3,
    customer: "Cameron Williamso",
    role: "Product Designer",
    amount: "$20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron3",
  },
  {
    id: 4,
    customer: "Cameron Williamso",
    role: "Product Designer",
    amount: "$20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron4",
  },
  {
    id: 5,
    customer: "Cameron Williamso",
    role: "Product Designer",
    amount: "$20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron5",
  },
]

export function PendingPayment() {
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-[18px] text-[#333733] font-semibold">Pending Payment</CardTitle>
          <CardDescription className="text-xs text-[#8C8F8C]">Approve pending professional profiles.</CardDescription>
        </div>
        <Button variant="link" size="sm" className="text-primary">
          See all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-[#F8F8FF] bg-[#F8F8FF]">
                <TableHead className="font-medium">Customer</TableHead>
                <TableHead className="font-medium">Amount</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id} className="border-b border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={payment.avatar || "/placeholder.svg"} alt={payment.customer} />
                        <AvatarFallback>{payment.customer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base text-[#333733] font-medium">{payment.customer}</p>
                        <p className="text-xs text-[#8C8F8C]">{payment.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{payment.amount}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}