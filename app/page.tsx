"use client";

import Link from "next/link";
import { LayoutDashboard, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#2D1B69] relative overflow-hidden flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/common/pattern-grid.svg')] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#F58220] rounded-full blur-[128px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#F58220] rounded-full blur-[128px] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-white/80 text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-2 h-2 rounded-full bg-[#F58220]" />
          <span>Sistem Informasi Manajemen Terpadu</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Tax Center
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58220] to-[#ff9e4a]">
            Universitas Gunadarma
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Platform terintegrasi untuk mengelola data relawan, kegiatan, riset,
          dan layanan perpajakan secara efisien dan transparan.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link href="/auth/sign-in">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-white text-[#2D1B69] hover:bg-white/90 font-semibold text-base shadow-lg shadow-white/10 transition-all hover:scale-105"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Masuk Sekarang
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white font-semibold text-base backdrop-blur-sm transition-all hover:scale-105"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Ke Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-white/30 text-sm animate-in fade-in duration-1000 delay-500">
        &copy; {new Date().getFullYear()} Tax Center Universitas Gunadarma. All
        rights reserved.
      </div>
    </div>
  );
}
