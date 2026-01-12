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
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    
    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken

    const { data, isLoading } = useQuery<AdminListResponse>({
        queryKey: ["worker", currentPage],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/team?page=${currentPage}&limit=10`, {
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

    // const handleEditClick = (admin: Admin) => {
    //     setSelectedAdmin(admin)
    //     setIsEditModalOpen(true)
    // }

    const handleViewClick = (admin: Admin) => {
        setSelectedAdmin(admin)
        setIsViewModalOpen(true)
    }

    const pagination = data?.data?.pagination

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

            <div className="bg-white rounded-3xl p-6">
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
                                                {/* <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-[10px] border-gray-300"
                                                    onClick={() => handleEditClick(member)}
                                                >
                                                    Edit
                                                </Button> */}
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
                {pagination && (
                    <div className="mt-6 flex justify-between items-center pt-4 border-t">
                        <p className="text-xs text-gray-500">
                            Showing {((currentPage - 1) * 10 + 1)} to {Math.min(currentPage * 10, pagination.totalData)} of {pagination.totalData} results
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={!pagination.hasPrevPage}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                <Button
                                    key={p}
                                    variant={currentPage === p ? "default" : "outline"}
                                    size="sm"
                                    className={cn(currentPage === p && "bg-gray-200")}
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </Button>
                            ))}

                            <Button
                                variant="outline"
                                size="icon"
                                disabled={!pagination.hasNextPage}
                                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <WorkerModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                showStatusField={false}
            />
            <WorkerModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                admin={selectedAdmin}
                showStatusField={true}
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
