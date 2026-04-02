"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 text-center">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-full shadow-lg mb-6 animate-bounce">
        <FileQuestion className="w-16 h-16 text-[#F58220]" />
      </div>

      <h1 className="text-4xl font-black text-[#2D1B69] dark:text-white mb-2 tracking-tight">
        404
      </h1>
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diganti,
        atau memang tidak tersedia.
      </p>

      <Button asChild className="bg-[#2D1B69] hover:bg-[#20134d] text-white">
        <Link href="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Link>
      </Button>
    </div>
  );
}
