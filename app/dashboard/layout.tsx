"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";
import AppTopbar from "@/components/common/app-topbar";
import { useCurrentUserPolling } from "@/hooks/use-current-user-polling";
import { routesAdmin } from "@/routes/routes-admin";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useCurrentUserPolling(true);

  return (
    <SidebarProvider
      className="gap-0"
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar routes={routesAdmin} />
      <SidebarInset className="bg-[#F8F9FC] dark:bg-[#09090b] flex flex-col min-w-0">
        <AppTopbar />
        <main className="p-6 lg:p-10 space-y-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
