
"use client"

import { useState, Suspense } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import ViewAdminModal from "@/components/Modal/ViewAdminModal"
import WorkerModal from "./_components/edit-worker"

type Admin = {
  _id: string
  name: string
  email: string
  role: string
  permissions: string[]
  status: string
  createdBy: { _id: string; email: string }
  createdAt: string
  updatedAt: string
  __v: number
}

type Pagination = {
  currentPage: number
  totalPages: number
  totalData: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

type AdminListResponse = {
  status: boolean
  message: string
  data: {
    admins: Admin[]
    pagination: Pagination
  }
}

function WorkersManagementContent() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    
    

    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken

    const { data, isLoading } = useQuery<AdminListResponse>({
        queryKey: ["worker"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/team`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!res.ok) throw new Error("Failed to fetch workers")
            return res.json()
        },
        enabled: !!token,
    })

    const handleEditClick = (admin: Admin) => {
        setSelectedAdmin(admin)
        setIsEditModalOpen(true)
    }

    const handleViewClick = (admin: Admin) => {
        setSelectedAdmin(admin)
        setIsViewModalOpen(true)
    }

    return (
        <div className="mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-900">Workers Management</h1>
                <div className="flex items-center text-sm text-gray-500">
                    <span>Dashboard</span>
                    <span className="mx-2 text-gray-300">›</span>
                    <span className="text-gray-400">Workers Management</span>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-[0px_4px_10px_0px_#0000001A] border border-gray-100">
                {/* Title + Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Workers Team</h2>
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#0EA5E9] hover:bg-blue-600 text-white rounded-full px-6 py-2 h-auto text-xs font-medium"
                    >
                        Add Worker
                    </Button>
                </div>

                {/* Filters */}
                {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search ......"
                            className="pl-10 h-10 border-gray-200 rounded-xl bg-gray-50/50"
                        />
                    </div>

                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px] h-10 border-gray-200 rounded-xl bg-gray-50/50">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspend">Suspend</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}

                {/* Table */}
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-100">
                                <TableHead className="text-[10px] uppercase text-gray-400">Admin ID</TableHead>
                                <TableHead className="text-[10px] uppercase text-gray-400">Name</TableHead>
                                <TableHead className="text-[10px] uppercase text-gray-400">Email</TableHead>
                                <TableHead className="text-[10px] uppercase text-gray-400">Last Active</TableHead>
                                <TableHead className="text-[10px] uppercase text-gray-400">Status</TableHead>
                                <TableHead className="text-[10px] uppercase text-gray-400 text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 text-center text-gray-400">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : data?.data?.admins.length ? (
                                data.data.admins.map((member) => (
                                    <TableRow key={member._id} className="border-b last:border-0">
                                        <TableCell className="py-6 font-medium text-xs">{member._id.slice(-8)}</TableCell>
                                        <TableCell className="py-6">{member.name}</TableCell>
                                        <TableCell className="py-6">{member.email}</TableCell>
                                        <TableCell className="py-6">{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="py-6">
                                            <Badge
                                                className={cn(
                                                    "rounded-full px-3 py-1 text-[10px]",
                                                    member.status === "Active"
                                                        ? "bg-emerald-100 text-emerald-600"
                                                        : "bg-indigo-100 text-indigo-600"
                                                )}
                                            >
                                                {member.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-[10px] border-gray-300"
                                                    onClick={() => handleEditClick(member)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="bg-[#0EA5E9] hover:bg-blue-600 text-white text-[10px]"
                                                    onClick={() => handleViewClick(member)}
                                                >
                                                    View Details
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-6 text-center text-gray-400">
                                        No workers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center pt-4 border-t">
                    <p className="text-xs text-gray-500">
                        Showing {data?.data?.admins.length ?? 0} of {data?.data?.pagination.totalData ?? 0} results
                    </p>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" disabled={!data?.data?.pagination.hasPrevPage}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: data?.data?.pagination.totalPages ?? 1 }, (_, i) => i + 1).map((p) => (
                            <Button
                                key={p}
                                variant="ghost"
                                size="icon"
                                className={cn(p === data?.data?.pagination.currentPage && "bg-gray-200")}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button variant="ghost" size="icon" disabled={!data?.data?.pagination.hasNextPage}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <WorkerModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                showStatusField={false} // hide status on add modal
            />
            <WorkerModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                admin={selectedAdmin}
                showStatusField={true} // show status on edit
            />
            <ViewAdminModal
                admin={selectedAdmin}
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
            />
        </div>
    )
}

export default function WorkersManagementPage() {
    return (
        <Suspense fallback={null}>
            <WorkersManagementContent />
        </Suspense>
    )
}
