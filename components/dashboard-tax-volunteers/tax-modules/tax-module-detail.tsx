"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Loader2,
  User,
  Info,
  Maximize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetData } from "@/hooks/use-get-data";
import { getImageUrl } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaxModuleDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  created_by: {
    full_name: string;
  };
}

export default function TaxModuleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = params.id;

  const { data: module, isLoading } = useGetData<TaxModuleDetail>({
    key: ["tax-module-detail", id],
    url: `/tax-module/${id}`,
  });

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <FileText className="h-16 w-16 text-muted-foreground/30" />
        <p className="text-muted-foreground text-lg">Modul tidak ditemukan.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const fileUrl = getImageUrl(module.file_url);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl border-zinc-200 dark:border-zinc-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-[#2D1B69] dark:text-zinc-100 line-clamp-1">
              {module.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {module.created_by?.full_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(module.created_at).toLocaleDateString("id-ID", {
                  dateStyle: "medium",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#2D1B69] hover:bg-[#1e124a] text-white shadow-lg shadow-[#2D1B69]/20 rounded-xl"
            asChild
          >
            <a
              href={fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
        <Card className="lg:col-span-4 flex flex-col border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden h-fit lg:h-full max-h-none lg:max-h-full">
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-[#F58220]" />
                Detail Modul
              </CardTitle>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1">
            <CardContent className="p-6">
              <div className="prose dark:prose-invert prose-sm max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed">
                <h3 className="text-foreground font-semibold mb-2">
                  Deskripsi
                </h3>

                {module.description.length < 100 && (
                  <p className="mt-4 text-muted-foreground italic">
                    Modul ini disusun untuk membantu relawan pajak memahami
                    materi perpajakan terkait {module.category}. Silakan baca
                    dokumen di samping untuk materi lengkapnya.
                  </p>
                )}
              </div>
            </CardContent>
          </ScrollArea>
        </Card>

        <Card className="lg:col-span-8 flex flex-col border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-zinc-100 dark:bg-zinc-900 h-[600px] lg:h-full">
          <div className="flex-1 relative w-full h-full">
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-full rounded-none"
            >
              <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center space-y-4">
                <div className="h-20 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    Pratinjau tidak tersedia
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto text-sm">
                    Browser Anda mungkin tidak mendukung pratinjau PDF langsung,
                    atau file tersebut bukan PDF.
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    <Maximize2 className="mr-2 h-4 w-4" />
                    Buka File Asli
                  </a>
                </Button>
              </div>
            </object>
          </div>
        </Card>
      </div>
    </div>
  );
}
