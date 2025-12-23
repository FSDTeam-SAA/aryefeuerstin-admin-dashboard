
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("rememberedUser1");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      form.setValue("email", parsed.email || "");
      form.setValue("password", parsed.password || "");
      form.setValue("rememberMe", true);
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      if (values.rememberMe) {
        localStorage.setItem(
          "rememberedUser1",
          JSON.stringify({
            email: values.email,
            password: values.password,
          })
        );
      } else {
        localStorage.removeItem("rememberedUser1");
      }

      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }
      
      window.location.href = "/";
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center  px-4">
      {/* Card */}
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

        {/* Heading */}
        <div className="mb-8 text-center">
          <h3 className="text-[32px] font-semibold text-gray-900">
            Welcome
          </h3>
          <p className="text-gray-500 text-[15px] mt-1">
            Sign in to continue your journey
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="hello@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="••••••••"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                      />
                    </FormControl>
                    <FormLabel className="text-sm cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Link
                href="/forgot-password"
                className="text-sm text-red-600 underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#31B8FA] hover:bg-[#31B8FA]/90 text-white text-[16px] py-5 shadow-md hover:shadow-lg transition"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
