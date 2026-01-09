"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Calendar, Clock, Hash } from "lucide-react"

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

export default function ViewAdminModal({
  admin,
  open,
  onOpenChange,
}: ViewAdminModalProps) {
  if (!admin) return null

  const isActive = admin.status === "Active"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-0 shadow-2xl border-0">
        
        {/* Modern Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-1">
                  {admin.name}
                </DialogTitle>
                <p className="text-indigo-100 text-sm font-medium">{admin.role}</p>
              </div>
              <Badge 
                className={`rounded-full px-4 py-1.5 text-xs font-bold shadow-lg ${
                  isActive 
                    ? "bg-emerald-500 text-white border-0" 
                    : "bg-rose-500 text-white border-0"
                }`}
              >
                ● {admin.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Mail className="w-4 h-4" />
              <span className="font-medium">{admin.email}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 py-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          
          {/* Admin ID Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100">
                <Hash className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Admin ID</p>
                <p className="font-mono text-sm text-gray-700 break-all">{admin._id}</p>
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-bold text-gray-800">Permissions & Access</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {admin.permissions.map((perm) => (
                <Badge
                  key={perm}
                  className="rounded-lg border-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 text-xs font-semibold shadow-md hover:shadow-lg transition-shadow"
                >
                  {perm}
                </Badge>
              ))}
            </div>
          </div>

          {/* Audit Information */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-800">Activity Timeline</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Created By</p>
                  <p className="font-semibold text-gray-800">{admin.createdBy?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(admin.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100">
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(admin.updatedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}