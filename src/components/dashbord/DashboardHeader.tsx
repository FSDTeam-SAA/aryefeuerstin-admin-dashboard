"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function DashboardHeader() {
  // Dummy user data (replace with real auth data later)
  

  const userName = "John Doe"
  const avatarImage = "" // use fallback if empty
  const initials = userName.charAt(0).toUpperCase()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 lg:pl-64">
      <div className="flex items-center justify-end px-6 py-4 bg-[#FFFFFF]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-white">{userName}</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarImage} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}