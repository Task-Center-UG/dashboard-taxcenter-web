"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const emailSchema = z.object({
  email: z.string().email({ message: "Format email tidak valid" }),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: "OTP harus 6 digit" }),
});

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, { message: "Minimal 8 karakter" }),
    confirmPassword: z.string().min(8, { message: "Minimal 8 karakter" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const requestOtpMutation = useMutation({
    mutationFn: async (values: z.infer<typeof emailSchema>) => {
      const res = await axiosInstance.post("/auth/forgot-password", values);
      return res.data;
    },
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setStep(2);
      toast.success("OTP Terkirim", {
        description: "Silakan cek email Anda untuk kode verifikasi.",
      });
    },
    onError: (error: any) => {
      toast.error("Gagal Mengirim OTP", {
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (values: z.infer<typeof otpSchema>) => {
      const payload = { email: email, otp: values.otp };
      const res = await axiosInstance.post("/auth/verify-otp", payload);
      return res.data;
    },
    onSuccess: (data) => {
      setResetToken(data.data.resetToken);
      setStep(3);
      toast.success("OTP Valid", {
        description: "Silakan buat kata sandi baru Anda.",
      });
    },
    onError: (error: any) => {
      toast.error("Verifikasi Gagal", {
        description:
          error.response?.data?.message || "Kode OTP salah atau kadaluarsa.",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof resetPasswordSchema>) => {
      const payload = {
        resetToken: resetToken,
        newPassword: values.newPassword,
      };
      const res = await axiosInstance.post("/auth/reset-password", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password Berhasil Diubah", {
        description: "Silakan masuk dengan password baru Anda.",
      });
      router.push("/auth/sign-in");
    },
    onError: (error: any) => {
      toast.error("Gagal Reset Password", {
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    },
  });

  const onEmailSubmit = (values: z.infer<typeof emailSchema>) => {
    requestOtpMutation.mutate(values);
  };

  const onOtpSubmit = (values: z.infer<typeof otpSchema>) => {
    verifyOtpMutation.mutate(values);
  };

  const onResetSubmit = (values: z.infer<typeof resetPasswordSchema>) => {
    resetPasswordMutation.mutate(values);
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
            Pemulihan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58220] to-orange-300">
              Akun Pengguna
            </span>
          </h1>
          <p className="text-white/70 text-lg max-w-md leading-relaxed">
            Ikuti langkah-langkah untuk mengatur ulang kata sandi Anda dan
            mendapatkan kembali akses ke dashboard.
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
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="space-y-2 px-0 text-center lg:text-left mb-4">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-[#2D1B69] mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Login
              </Link>

              <CardTitle className="text-3xl font-bold tracking-tight text-[#2D1B69] dark:text-white">
                {step === 1 && "Lupa Kata Sandi?"}
                {step === 2 && "Verifikasi OTP"}
                {step === 3 && "Buat Sandi Baru"}
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {step === 1 && "Masukkan email Anda untuk menerima kode OTP."}
                {step === 2 && `Kode OTP telah dikirim ke ${email}`}
                {step === 3 && "Masukkan kata sandi baru yang aman."}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Form {...emailForm}>
                      <form
                        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                        className="space-y-5"
                      >
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Terdaftar</FormLabel>
                              <FormControl>
                                <div className="group relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    placeholder="nama@email.com"
                                    className="pl-10 h-13 py-6 rounded-xl"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full h-13 py-6 bg-[#2D1B69] hover:bg-[#1e124a] text-white font-bold rounded-xl"
                          disabled={requestOtpMutation.isPending}
                        >
                          {requestOtpMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            "Kirim Kode OTP"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Form {...otpForm}>
                      <form
                        onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                        className="space-y-5"
                      >
                        <FormField
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kode OTP</FormLabel>
                              <FormControl>
                                <div className="group relative">
                                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    placeholder="123456"
                                    className="pl-10 h-13 py-6 rounded-xl tracking-[0.5em] font-mono text-lg"
                                    maxLength={6}
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full h-13 py-6 bg-[#2D1B69] hover:bg-[#1e124a] text-white font-bold rounded-xl"
                          disabled={verifyOtpMutation.isPending}
                        >
                          {verifyOtpMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            "Verifikasi Kode"
                          )}
                        </Button>
                        <div className="text-center">
                          <Button
                            variant="link"
                            type="button"
                            className="text-muted-foreground"
                            onClick={() => setStep(1)}
                          >
                            Ganti Email
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Form {...resetForm}>
                      <form
                        onSubmit={resetForm.handleSubmit(onResetSubmit)}
                        className="space-y-5"
                      >
                        <FormField
                          control={resetForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kata Sandi Baru</FormLabel>
                              <FormControl>
                                <div className="group relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-12 h-13 py-6 rounded-xl"
                                    {...field}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
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

                        <FormField
                          control={resetForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                              <FormControl>
                                <div className="group relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10 h-13 py-6 rounded-xl"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full h-13 py-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20"
                          disabled={resetPasswordMutation.isPending}
                        >
                          {resetPasswordMutation.isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5" />
                              Simpan Password Baru
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
