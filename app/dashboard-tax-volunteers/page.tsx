"use client";

import { BookText, FileImage } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetData } from "@/hooks/use-get-data";

interface UserProfile {
  id: number;
  full_name: string;
}

interface TaxVolunteerStats {
  totalTaxModule: number;
  totalDocs: number;
}

export default function Page() {
  const { data: user } = useGetData<UserProfile>({
    key: ["user-profile"],
    url: "/users/profile",
  });

  const { data: stats, isLoading: isLoadingStats } = useGetData<TaxVolunteerStats>({
    key: ["tax-volunteer-dashboard-stats"],
    url: "/dashboard/tax-volunteer/stats",
  });

  const totalModules = stats?.totalTaxModule ?? 0;
  const totalMyDocs = stats?.totalDocs ?? 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#2D1B69]/20 bg-gradient-to-r from-[#2D1B69] to-[#3b2488] p-6 text-white shadow-xl shadow-[#2D1B69]/20 md:p-8">
        <Badge className="mb-3 w-fit bg-white/20 text-white hover:bg-white/25">
          Relawan Pajak Dashboard
        </Badge>
        <h2 className="text-2xl font-bold md:text-3xl">
          Selamat datang{user?.full_name ? `, ${user.full_name}` : ""}
        </h2>
        <p className="mt-2 max-w-2xl text-white/85">
          Ringkasan cepat modul pembelajaran dan dokumentasi yang sudah kamu
          upload.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription>Total Module</CardDescription>
            <CardTitle className="flex items-center justify-between text-3xl">
              {isLoadingStats ? "..." : totalModules}
              <BookText className="h-5 w-5 text-[#2D1B69] dark:text-[#F58220]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Total seluruh modul pembelajaran yang tersedia.
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardDescription>Dokumentasi Saya</CardDescription>
            <CardTitle className="flex items-center justify-between text-3xl">
              {isLoadingStats ? "..." : totalMyDocs}
              <FileImage className="h-5 w-5 text-[#2D1B69] dark:text-[#F58220]" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Total dokumentasi yang kamu upload sendiri.
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
