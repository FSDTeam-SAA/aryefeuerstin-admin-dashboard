"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export function VerifyOtp() {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const decodedEmail = decodeURIComponent(email || "")

    // 🔢 Handle OTP input
    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return
        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (digits.length > 0) {
            const newOtp = digits.split("").concat(Array(6 - digits.length).fill(""))
            setOtp(newOtp)
            const nextEmptyIndex = newOtp.findIndex((d) => d === "")
            const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
            setTimeout(() => {
                document.getElementById(`otp-${focusIndex}`)?.focus()
            }, 0)
        }
    }

    const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
        mutationKey: ["verify-otp"],
        mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-code`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp }),
                }
            )
            return res.json()
        },
        onSuccess: (data) => {
            if (!data?.status) {
                toast.error(data?.message || "Invalid OTP. Please try again.")
                return
            }
            toast.success(data?.message || "OTP verified successfully!")
            router.push("/change-password?email=" + encodeURIComponent(decodedEmail))
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.")
        },
    })

    const { mutate: resendOtp, isPending: isResending } = useMutation({
        mutationKey: ["resend-otp"],
        mutationFn: async (email: string) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            )
            return res.json()
        },
        onSuccess: (data) => {
            if (!data?.success) {
                toast.error(data?.message || "Failed to resend OTP.")
                return
            }
            toast.success(data?.message || "OTP sent successfully!")
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.")
        },
    })

    const handleVerify = () => {
        const fullOtp = otp.join("")
        if (fullOtp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP.")
            return
        }
        verifyOtp({ email: decodedEmail, otp: fullOtp })
    }

    const handleResend = () => {
        setOtp(["", "", "", "", "", ""])
        resendOtp(decodedEmail)
    }

    const isComplete = otp.every((digit) => digit !== "")

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/bg.jpg')" }}
        >
            <div className="w-full max-w-xl rounded-2xl  p-8 sm:p-10 ">
                {/* Logo */}
                <div className="flex justify-center">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={900}
                            height={900}
                            className="object-contain w-52 h-52 hover:scale-105 transition-transform duration-200"
                            priority
                        />
                    </Link>
                </div>

                <div className="relative z-10  p-8 sm:p-10 w-full max-w-[500px]">
                    <div className="mb-8">
                        <h3 className="text-[#131313] text text-[36px] font-semibold">
                            Verify OTP
                        </h3>
                        <p className="text-[#6C757D]  text-[15px] mt-1">
                            Enter your OTP to recover your password
                        </p>
                    </div>

                    <Card className="border-none shadow-none">
                        {/* OTP Inputs */}
                        <div className="flex gap-3 mb-6 justify-center">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    className="h-12 w-12 text-center text-lg font-semibold border-2 text-[#31B8FA] border-[#B6B6B6] rounded-lg focus:ring-0"
                                    placeholder="•"
                                    inputMode="numeric"
                                    autoComplete="off"
                                />
                            ))}
                        </div>

                        {/* Resend */}
                        <div className="mb-6 text-end">
                            <button
                                onClick={handleResend}
                                className="text-sm font-medium text-[#8C8F8C] hover:text-[#8C8F8C] underline inline-flex  gap-1"
                            >
                               Don’t get a code? <span className="text-[#31B8FA]">Resend</span>
                                {isResending && <Loader2 className="animate-spin ml-1" size={16} />}
                            </button>
                        </div>

                        {/* Verify Button */}
                        <Button
                            onClick={handleVerify}
                            disabled={!isComplete || isVerifyingOtp}
                            className="w-full bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white font-semibold py-2 rounded-lg"
                        >
                            {isVerifyingOtp ? (
                                <>
                                    Verifying <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>
                    </Card>
                </div>
            </div>

        </div>
    )
}
