"use client";

import { Activity, Handshake, Newspaper, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetData } from "@/hooks/use-get-data";

type DistributionCategoryKey =
  | "SPT_ASSISTANT"
  | "PUBLIC_RELATIONS_FUNCTION"
  | "SUPPORTING_ACTIVITIES"
  | "BUSINESS_DEVELOPMENT_SERVICES";

interface AdminDashboardStats {
  totalNews: number;
  totalMbkmAccepted: number;
  totalNonMbkmAccepted: number;
  totalDivisiAndAssistant: number;
  newsTrendsAndVolunteerRegistration: {
    labels: string[];
    totalTaxVolunteerMonthly: number[];
    totalNewsMonthly: number[];
  };
  distributionOfRelpakActivityCategories: Record<DistributionCategoryKey, number>;
}

const trafficChartConfig = {
  news: {
    label: "News",
    color: "#2D1B69",
  },
  registrations: {
    label: "Pendaftar Relawan",
    color: "#F58220",
  },
} satisfies ChartConfig;

const contentChartConfig = {
  total: {
    label: "Relawan",
    color: "#2D1B69",
  },
} satisfies ChartConfig;

const categoryLabelMap: Record<DistributionCategoryKey, string> = {
  SPT_ASSISTANT: "Asistensi SPT",
  PUBLIC_RELATIONS_FUNCTION: "Fungsi Humas",
  SUPPORTING_ACTIVITIES: "Kegiatan Pendukung",
  BUSINESS_DEVELOPMENT_SERVICES: "Layanan Pengembangan Usaha",
};

export default function Page() {
  const { data: stats, isLoading, isError } = useGetData<AdminDashboardStats>({
    key: ["admin-dashboard-stats"],
    url: "/dashboard/admin/stats",
  });

  const trend = stats?.newsTrendsAndVolunteerRegistration;
  const labels = trend?.labels ?? [];
  const monthlyVisitors = labels.map((month, idx) => ({
    month,
    news: trend?.totalNewsMonthly?.[idx] ?? 0,
    registrations: trend?.totalTaxVolunteerMonthly?.[idx] ?? 0,
  }));

  const distributionRaw = stats?.distributionOfRelpakActivityCategories;
  const activityCategoryDistribution: Array<{ name: string; total: number }> = (
    Object.keys(categoryLabelMap) as DistributionCategoryKey[]
  ).map((key) => ({
    name: categoryLabelMap[key],
    total: distributionRaw?.[key] ?? 0,
  }));

  const kpiCards = [
    {
      title: "Total News",
      value: stats?.totalNews ?? 0,
      icon: Newspaper,
      note: "Konten berita aktif",
    },
    {
      title: "Relawan MBKM",
      value: stats?.totalMbkmAccepted ?? 0,
      icon: Users,
      note: "Total peserta MBKM diterima",
    },
    {
      title: "Relawan Non-MBKM",
      value: stats?.totalNonMbkmAccepted ?? 0,
      icon: Activity,
      note: "Total peserta Non-MBKM diterima",
    },
    {
      title: "Divisi + Asisten",
      value: stats?.totalDivisiAndAssistant ?? 0,
      icon: Handshake,
      note: "Total divisi dan asisten",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[#2D1B69]/15 bg-gradient-to-r from-[#2D1B69] to-[#4d35a2] p-6 text-white shadow-xl shadow-[#2D1B69]/20 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Badge className="w-fit bg-white/15 text-white hover:bg-white/20">
              Dashboard Analytics
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Ringkasan performa Tax Center
            </h2>
            <p className="max-w-2xl text-sm text-white/80 md:text-base">
              Statistik realtime untuk melihat tren news, relawan, dan aktivitas
              terbaru dalam satu layar.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm backdrop-blur-sm">
            Update terakhir:{" "}
            {new Date().toLocaleString("id-ID", {
              dateStyle: "long",
              timeStyle: "short",
            })}{" "}
            WIB
          </div>
        </div>
      </section>

      {isError && (
        <Card className="rounded-2xl border-red-200 dark:border-red-900">
          <CardContent className="py-4 text-sm text-red-600 dark:text-red-400">
            Gagal memuat statistik dashboard. Menampilkan data kosong.
          </CardContent>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((item) => (
          <Card
            key={item.title}
            className="rounded-2xl border-zinc-200 dark:border-zinc-800"
          >
            <CardHeader className="pb-2">
              <CardDescription>{item.title}</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl">{item.value}</CardTitle>
                <item.icon className="h-5 w-5 text-[#2D1B69] dark:text-[#F58220]" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Tren News dan Pendaftar Relawan</CardTitle>
              <CardDescription>
              Data bulanan news dan total pendaftar relawan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={trafficChartConfig}
              className="h-[320px] w-full"
            >
              <AreaChart
                data={monthlyVisitors.length > 0 ? monthlyVisitors : []}
                margin={{ left: 10, right: 10, top: 8 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="news"
                  fill="var(--color-news)"
                  fillOpacity={0.2}
                  stroke="var(--color-news)"
                  strokeWidth={2.2}
                />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  fill="var(--color-registrations)"
                  fillOpacity={0.25}
                  stroke="var(--color-registrations)"
                  strokeWidth={2.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Distribusi Kategori Kegiatan Relpak</CardTitle>
            <CardDescription>
              Total kegiatan relawan pajak berdasarkan kategori
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={contentChartConfig}
              className="h-[320px] w-full"
            >
              <BarChart
                data={activityCategoryDistribution}
                layout="vertical"
                margin={{ left: 6, right: 12 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={170}
                />
                <ChartTooltip
                  content={<ChartTooltipContent labelKey="name" />}
                />
                <Bar
                  dataKey="total"
                  radius={[0, 10, 10, 0]}
                  fill="var(--color-total)"
                />
              </BarChart>
            </ChartContainer>
            {isLoading && (
              <p className="mt-3 text-xs text-muted-foreground">
                Memuat statistik...
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
