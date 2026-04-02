"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { Eye, EyeOff, Loader2, Lock, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { setUserCookie } from "@/lib/auth-cookie";
import Link from "next/link";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username wajib diisi" }),
  password: z.string().min(1, { message: "Kata sandi wajib diisi" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      await axiosInstance.post("/auth/login", values);
      const profileRes = await axiosInstance.get("/users/profile");
      return profileRes.data.data;
    },
    onSuccess: (user) => {
      setUserCookie(user);
      toast.success("Login Berhasil!", {
        description: `Selamat datang kembali, ${user.full_name}.`,
      });

      if (user.role?.name === "Tax Volunteer") {
        router.push("/dashboard-tax-volunteers");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error: any) => {
      const errMsg =
        error.response?.data?.message ||
        "Gagal masuk. Periksa username dan password.";
      toast.error("Login Gagal", { description: errMsg });
    },
  });

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex h-screen w-full bg-white dark:bg-zinc-950 overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 bg-[#2D1B69] flex-col justify-between p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute top-0 left-0 w-full h-full bg-[url('/common/pattern-grid.svg')] opacity-10"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#F58220] rounded-full blur-[120px] opacity-30"
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-xl">
            <ShieldCheck className="text-[#F58220] h-7 w-7" />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">
            TAX CENTER <span className="text-[#F58220]">UG</span>
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-[1.1]">
            Sistem Informasi <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58220] to-orange-300">
              Manajemen Terpadu
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Platform modern untuk pengelolaan relawan dan layanan pajak
            Universitas Gunadarma secara efisien.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-white/50 text-sm font-medium">
          &copy; {new Date().getFullYear()} Tax Center Universitas Gunadarma
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 relative h-full w-full">
        <div className="lg:hidden absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gray-50/50 dark:bg-zinc-950">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2D1B69]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#F58220]/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-zinc-900 lg:bg-transparent p-4 rounded-2xl lg:p-0 shadow-2xl shadow-black/5 lg:shadow-none"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-2 px-0 text-center lg:text-left mb-4">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="h-12 w-12 bg-[#2D1B69] rounded-xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="text-[#F58220] h-7 w-7" />
                </div>
              </div>
              <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2D1B69] dark:text-white">
                Masuk
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Silakan masukkan akun Anda untuk melanjutkan.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-zinc-700 dark:text-zinc-300">
                          Username
                        </FormLabel>
                        <FormControl>
                          <div className="group relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#2D1B69] transition-colors" />
                            <Input
                              placeholder="Masukkan username anda"
                              className="pl-10 h-13 py-6 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#2D1B69]/20 focus-visible:border-[#2D1B69] transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="font-semibold text-zinc-700 dark:text-zinc-300">
                            Kata Sandi
                          </FormLabel>
                          <Button
                            asChild
                            variant="link"
                            className="h-auto p-0 text-[#F58220] font-semibold text-sm hover:no-underline"
                          >
                            <Link
                              href={"/auth/forgot-password"}
                              className="hover:underline"
                            >
                              Lupa sandi?
                            </Link>
                          </Button>
                        </div>
                        <FormControl>
                          <div className="group relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-[#2D1B69] transition-colors" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 pr-12 h-13 py-6 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#2D1B69]/20 focus-visible:border-[#2D1B69] transition-all"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#2D1B69] transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-13 py-6 bg-[#2D1B69] hover:bg-[#1e124a] text-white font-bold rounded-xl transition-all shadow-xl shadow-[#2D1B69]/10 active:scale-[0.98]"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Memvalidasi...
                      </div>
                    ) : (
                      "Masuk ke Dashboard"
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-8 text-center lg:text-left border-t border-zinc-100 dark:border-zinc-800 pt-6">
                <p className="text-sm text-muted-foreground">
                  Belum memiliki akses?{" "}
                  <button className="text-[#2D1B69] dark:text-orange-400 font-bold hover:underline">
                    Hubungi Admin
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
