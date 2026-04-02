"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarDays,
  BookOpen,
  ArrowRight,
  FileText,
  Clock,
  User,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";

interface TaxModule {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
  created_at: string;
  created_by: {
    full_name: string;
  };
}

interface TaxModuleResponse {
  taxModules: TaxModule[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

export default function TaxModuleList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetData<TaxModuleResponse>({
    key: ["tax-modules", String(page), debouncedSearch],
    url: "/tax-module",
    params: {
      page: page,
      size: 9,
      title: debouncedSearch || undefined,
      sort_by: "created_at",
      order: "desc",
    },
  });

  const modules = data?.taxModules || [];
  const paging = data?.paging;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-[#2D1B69] dark:text-white">
            Modul Pembelajaran
          </h1>
          <p className="text-muted-foreground text-base max-w-lg">
            Tingkatkan pengetahuan perpajakan Anda melalui kumpulan materi dan
            modul terupdate.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <Input
            placeholder="Cari judul modul..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-12 h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:ring-[#2D1B69] transition-all shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card
              key={i}
              className="rounded-2xl overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <div className="h-48 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((item) => (
            <Card
              key={item.id}
              className="group flex flex-col h-full rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-xl hover:shadow-[#2D1B69]/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-900/50 flex items-center justify-center border-b border-zinc-100 dark:border-zinc-800 group-hover:from-blue-100/50 group-hover:to-indigo-100/50 dark:group-hover:from-zinc-800 dark:group-hover:to-zinc-900 transition-colors">
                <div className="absolute inset-0 bg-[url('/common/pattern-grid.svg')] opacity-[0.03] dark:opacity-[0.05]" />
                <div className="h-16 w-16 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-8 w-8 text-[#2D1B69] dark:text-[#F58220]" />
                </div>
              </div>

              <CardHeader className="flex-grow p-6 pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{item.created_by.full_name}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-50 group-hover:text-[#2D1B69] dark:group-hover:text-[#F58220] transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </CardHeader>

              <CardContent className="px-6 pb-6 pt-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {item.description ||
                    "Tidak ada deskripsi singkat untuk modul ini."}
                </p>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0 mt-auto">
                <Button
                  onClick={() =>
                    router.push(`/dashboard-tax-volunteers/modules/${item.id}`)
                  }
                  className="w-full bg-zinc-50 dark:bg-zinc-900 hover:bg-[#2D1B69] dark:hover:bg-[#F58220] text-zinc-900 dark:text-zinc-100 hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-transparent transition-all group/btn"
                >
                  <span className="font-medium">Pelajari Modul</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* --- EMPTY STATE --- */
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
          <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <BookOpen className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Modul Tidak Ditemukan
          </h3>
          <p className="text-muted-foreground max-w-sm mt-2 text-sm leading-relaxed">
            Sepertinya kami tidak dapat menemukan modul dengan kata kunci "
            <span className="font-medium text-foreground">{search}</span>".
            Silakan coba kata kunci lain atau reset pencarian.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            className="mt-6 rounded-full px-8"
          >
            Reset Pencarian
          </Button>
        </div>
      )}

      {paging && paging.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-10 w-10 rounded-full border-zinc-200 dark:border-zinc-800"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-foreground">
              Halaman {paging.page}
            </span>
            <span className="text-xs text-muted-foreground">
              dari {paging.total_pages}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(paging.total_pages, p + 1))}
            disabled={page === paging.total_pages}
            className="h-10 w-10 rounded-full border-zinc-200 dark:border-zinc-800"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
