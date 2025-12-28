"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

type Admin = {
    _id: string
    name: string
    email: string
    role: string
    permissions: string[]
    status: string
    createdBy: {
        _id: string
        email: string
    }
    createdAt: string
    updatedAt: string
    __v: number
}

interface ViewAdminModalProps {
    admin: Admin | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function ViewAdminModal({ admin, open, onOpenChange }: ViewAdminModalProps) {
    if (!admin) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl p-6 bg-white shadow-lg">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="text-lg font-bold">Admin Details</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-4">
                    {/* Basic Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-700">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><strong>ID:</strong> {admin._id}</p>
                            <p><strong>Role:</strong> {admin.role}</p>
                            <p><strong>Name:</strong> {admin.name}</p>
                            <p><strong>Status:</strong>
                                <Badge
                                    className={`ml-1 ${admin.status === "Active" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"}`}
                                >
                                    {admin.status}
                                </Badge>
                            </p>
                            <p className="col-span-2"><strong>Email:</strong> {admin.email}</p>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-700">Permissions</h3>
                        <div className="flex flex-wrap gap-2">
                            {admin.permissions.map((perm) => (
                                <Badge key={perm} className="bg-blue-100 text-blue-600">{perm}</Badge>
                            ))}
                        </div>
                    </div>

                    {/* Created Info */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-700">Created Info</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p><strong>Created By:</strong> {admin.createdBy.email}</p>
                            <p><strong>Created At:</strong> {new Date(admin.createdAt).toLocaleString()}</p>
                            <p className="col-span-2"><strong>Updated At:</strong> {new Date(admin.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
