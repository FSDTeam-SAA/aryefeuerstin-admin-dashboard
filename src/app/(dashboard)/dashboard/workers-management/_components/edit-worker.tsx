"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Check, Loader2, Shield } from "lucide-react"
import Image from "next/image"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

type Admin = {
    _id: string
    name: string
    email: string
    permissions: string[]
    status?: string
}

interface WorkerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    admin?: Admin | null 
    showStatusField?: boolean 
}

const PERMISSIONS = [
    "Overview",
    "Drivers Management",
    "Membership Status",
    "Payments Status",
    "Pickup History",
    "Orders request",
    "User Management",
    "Subscription Management",
    "Settings",
    "All Access"
]

export default function WorkerModal({
    open,
    onOpenChange,
    admin = null,
    showStatusField = true,
}: WorkerModalProps) {
    const isEdit = !!admin

    const { data: session } = useSession()
    const token = (session?.user as { accessToken?: string })?.accessToken
    const queryClient = useQueryClient()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
    const [status, setStatus] = useState("Active")

    // Pre-fill when editing
    useEffect(() => {
        if (isEdit && admin) {
            setName(admin.name)
            setEmail(admin.email)
            setSelectedPermissions(admin.permissions || [])
            setStatus(admin.status || "Active")
        } else {
            setName("")
            setEmail("")
            setSelectedPermissions([])
            setStatus("Active")
        }
    }, [admin, isEdit, open])

    const handleTogglePermission = (permission: string) => {
        if (permission === "All Access") {
            const allExceptAll = PERMISSIONS.filter((p) => p !== "All Access")
            setSelectedPermissions(
                selectedPermissions.length === allExceptAll.length
                    ? []
                    : allExceptAll
            )
            return
        }

        setSelectedPermissions((prev) =>
            prev.includes(permission)
                ? prev.filter((p) => p !== permission)
                : [...prev, permission]
        )
    }

    const mutation = useMutation({
        mutationFn: async (data: { name: string; email: string; permissions: string[]; status?: string }) => {
            if (!token) throw new Error("Unauthorized")

            const url = isEdit
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/team/${admin?._id}/permissions`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}/team`

            const method = isEdit ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.message || "Failed to save worker")
            }

            return res.json()
        },
        onSuccess: (data) => {
            toast.success(data.message || `Worker ${isEdit ? "updated" : "added"} successfully`)
            queryClient.invalidateQueries({ queryKey: ["worker"] })
            onOpenChange(false)
        },
        onError: (err) => {
            toast.error(err.message || "Failed to save worker")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate({ name, email, permissions: selectedPermissions, status })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] p-0 rounded-3xl border-none overflow-hidden shadow-2xl">
                {/* HEADER */}
                <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 px-8 py-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white rounded-2xl p-2 shadow-md">
                            <Image
                                src="/logo.png"
                                alt="EZ RETURNS"
                                width={48}
                                height={48}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-wide">EZ RETURNS</h2>
                            <p className="text-xs opacity-80 italic">handled with care</p>
                        </div>
                    </div>

                    <DialogHeader className="mt-6">
                        <DialogTitle className="text-2xl font-bold">
                            {isEdit ? "Edit Worker" : "Add New Worker"}
                        </DialogTitle>
                        <p className="text-sm opacity-90">
                            {isEdit ? "Update worker details and permissions" : "Create a worker account and assign permissions"}
                        </p>
                    </DialogHeader>
                </div>

                {/* BODY */}
                <form onSubmit={handleSubmit} className="bg-white px-8 py-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <Input
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 rounded-xl mt-2"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <Input
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 rounded-xl mt-2"
                            required
                            disabled={isEdit}
                        />
                    </div>

                    {/* Status */}
                    {isEdit && showStatusField && (
                        <div>
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="h-12 mt-2 w-full border-gray-200 rounded-xl bg-gray-50/50 px-3"
                            >
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>
                    )}

                    {/* Permissions */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="h-4 w-4 text-sky-500" />
                            <p className="text-sm font-semibold text-gray-900">Permissions</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-2">
                            {PERMISSIONS.map((permission) => {
                                const checked =
                                    selectedPermissions.includes(permission) ||
                                    (permission === "All Access" &&
                                        selectedPermissions.length === PERMISSIONS.length - 1)

                                return (
                                    <div
                                        key={permission}
                                        onClick={() => handleTogglePermission(permission)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition",
                                            checked
                                                ? "border-sky-500 bg-sky-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-5 h-5 rounded-md flex items-center justify-center",
                                                checked ? "bg-sky-500 text-white" : "border border-gray-300"
                                            )}
                                        >
                                            {checked && <Check className="h-3.5 w-3.5" />}
                                        </div>
                                        <span className="text-sm text-gray-700 font-medium">{permission}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-8 py-6 h-auto text-sm font-semibold flex items-center gap-2 shadow-lg"
                        >
                            <Check className="h-4 w-4" />
                            {isEdit ? "Update Worker" : "Save Worker"}
                            {mutation.isPending && <Loader2 className="animate-spin h-4 w-4" />}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
