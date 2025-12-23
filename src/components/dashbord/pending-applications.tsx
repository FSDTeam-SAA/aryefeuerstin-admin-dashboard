import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreVertical } from "lucide-react"

const applications = [
  {
    id: 1,
    name: "Cameron Williamson",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron1",
  },
  {
    id: 2,
    name: "Cameron Williamson",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron2",
  },
  {
    id: 3,
    name: "Cameron Williamson",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron3",
  },
  {
    id: 4,
    name: "Cameron Williamson",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron4",
  },
  {
    id: 5,
    name: "Cameron Williamson",
    role: "Product Designer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron5",
  },
]

export function PendingApplications() {
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-[18px] text-[#333733] font-semibold">Pending Applications</CardTitle>
          <CardDescription className="text-xs text-[#8C8F8C]">Approve pending professional profiles.</CardDescription>
        </div>
        <Button variant="link" size="sm" className="text-[#064420]">
          See all
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={app.avatar || "/placeholder.svg"} alt={app.name} />
                  <AvatarFallback>{app.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base text-[#333733] font-medium">{app.name}</p>
                  <p className="text-xs text-muted-foreground">{app.role}</p>
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