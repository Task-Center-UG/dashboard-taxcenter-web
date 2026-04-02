"use client";

import { Rocket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] bg-transparent p-4 text-center">
      <div className="relative">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#F58220] rounded-full blur-3xl opacity-20" />
        <div className="bg-gradient-to-br from-[#2D1B69] to-[#4c2dbe] p-6 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-500">
          <Rocket className="w-16 h-16 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-[#F58220]" />
        <span className="text-[#F58220] font-bold tracking-widest uppercase text-sm">
          Segera Hadir
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-[#2D1B69] dark:text-white mb-4">
        Fitur Sedang Dibangun
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Tim developer kami sedang bekerja keras untuk menghadirkan fitur hebat
        ini untuk Anda. Tunggu update selanjutnya!
      </p>

      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="text-[#2D1B69] dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        Kembali ke Halaman Sebelumnya
      </Button>
    </div>
  );
}
