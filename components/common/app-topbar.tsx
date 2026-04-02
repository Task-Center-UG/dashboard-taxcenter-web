"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "./mode-toggle";
import { UserNav } from "./user-nav";

const AppTopbar = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 transition-all shadow-sm">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="text-[#2D1B69] dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors" />
          <Separator
            orientation="vertical"
            className="h-6 bg-zinc-200 dark:bg-zinc-800"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-sm font-bold uppercase tracking-widest text-[#2D1B69] dark:text-zinc-100">
            <span className="text-[#F58220]">Dashboard</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <ModeToggle />
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1 hidden md:block" />
          <UserNav />
        </div>
      </div>
    </header>
  );
};

export default AppTopbar;
