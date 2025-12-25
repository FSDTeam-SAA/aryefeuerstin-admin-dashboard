"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const formSchema = z.object({
    email: z.string().min(1, "Email is required"),
});

export default function ForgetPassword() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });
    const router = useRouter();


    const { mutate, isPending } = useMutation({
        mutationKey: ["forgot-password"],
        mutationFn: (email: string) =>
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forget-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }).then((res) => res.json()),

        onSuccess: (data, email) => {

            if (!data?.status) {
                toast.error(data?.message || "Something went wrong");
                return;
            }

            toast.success(data?.message || "Email sent successfully!");
            console.log("sent ")
            router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            console.log("sent 1")
        },

        onError: (error) => {
            toast.error("Something went wrong. Please try again.");
            console.error("Forgot password error:", error);
        },
    });



    function onSubmit(values: z.infer<typeof formSchema>) {
        mutate(values.email);
    }

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" >
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
                    <div className="mb-10">
                        <h3 className="text-[#131313]  text-[40px] ">Forgot Password</h3>
                        <p className="text-[#424242] font-normal text-[16px] ">Enter your email to recover your password</p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-[16px]"
                        >
                            {/* Email */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#616161] font-medium text-[16px] mb-2">
                                            Email Address
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                {...field}
                                                placeholder="hello@example.com"
                                                className="border border-[#616161] py-4 focus-visible:ring-0 focus-visible:border-[#147575]"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="bg-[#31B8FA] hover:bg-[#31B8FA]/90 w-full text-white text-[16px] py-5 shadow-md hover:shadow-lg transition-shadow"
                            >
                                Send OTP {isPending && <Loader2 className="animate-spin mr-2" />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}