"use client";

import { Hammer, Wrench } from "lucide-react";

export default function MaintenancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2D1B69] text-white p-4 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/common/pattern-grid.svg')] opacity-10" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex gap-4 mb-6">
          <Wrench className="w-12 h-12 text-[#F58220] animate-spin-slow" />
          <Hammer className="w-12 h-12 text-white/50 animate-bounce" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Sedang Dalam Perbaikan</h1>
        <p className="text-white/70 max-w-lg text-lg leading-relaxed">
          Sistem Tax Center sedang melakukan pemeliharaan rutin untuk
          meningkatkan performa.
          <br />
          Kami akan segera kembali.
        </p>

        <div className="mt-8 px-4 py-2 bg-white/10 rounded-full border border-white/20 text-sm font-medium text-[#F58220]">
          Estimasi selesai: 1-2 Jam
        </div>
      </div>
    </div>
  );
}
