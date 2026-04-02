"use client";

import Link from "next/link";
import { ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 text-center">
      <div className="relative mb-6">
        <ShieldAlert className="w-24 h-24 text-[#2D1B69] dark:text-zinc-400 opacity-20" />
        <Lock className="w-10 h-10 text-[#F58220] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <h1 className="text-2xl font-bold text-[#2D1B69] dark:text-white mb-2">
        Akses Ditolak
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi
        administrator jika menurut Anda ini adalah kesalahan.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/auth/sign-in">Ganti Akun</Link>
        </Button>
        <Button asChild className="bg-[#2D1B69] hover:bg-[#20134d]">
          <Link href="/dashboard">Ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
