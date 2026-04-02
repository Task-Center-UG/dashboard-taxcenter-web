"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link2, Loader2, Save, Trash2, Video } from "lucide-react";

import { axiosInstance } from "@/lib/axios";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  video_url: z
    .string()
    .trim()
    .min(1, "URL video wajib diisi")
    .url("Format URL tidak valid"),
});

type FormValues = z.infer<typeof formSchema>;

interface CompanyProfileResponse {
  video_url: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.replace("www.", "");

    if (hostname === "youtu.be") {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        const videoId = parsed.pathname.split("/embed/")[1]?.split("/")[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export default function CompanyProfileVideoForm() {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video_url: "",
    },
  });

  const { data, isLoading } = useGetData<CompanyProfileResponse>({
    key: ["company-profile"],
    url: "/company-profile",
    options: {
      retry: 1,
    },
  });

  useEffect(() => {
    if (data?.video_url) {
      form.setValue("video_url", data.video_url, { shouldValidate: true });
    }
  }, [data?.video_url, form]);

  const saveMutation = usePutData<any, FormValues>({
    url: "/company-profile",
    invalidateKeys: [["company-profile"]],
    successMessage: "Video company profile berhasil diperbarui",
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete("/company-profile");
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-profile"] });
      form.setValue("video_url", "");
      toast.success("Video company profile berhasil dihapus");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        "Gagal menghapus video company profile";
      toast.error(message);
    },
  });

  const onSubmit = (values: FormValues) => {
    saveMutation.mutate({ data: values });
  };

  const watchedVideoUrl = form.watch("video_url");
  const embedUrl = watchedVideoUrl ? getYouTubeEmbedUrl(watchedVideoUrl) : null;

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-[#2D1B69] dark:text-[#F58220]" />
          Company Profile Video
        </CardTitle>
        <CardDescription>
          Atur URL video company profile yang akan ditampilkan di beranda
          website.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 md:p-8 bg-white dark:bg-zinc-950">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#2D1B69]" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Video</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://youtu.be/..."
                          className="pl-9 h-11 rounded-xl bg-zinc-50/50"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/40 dark:bg-zinc-900/40 space-y-4">
                <p className="text-sm font-medium">Preview URL</p>
                <p className="text-sm text-muted-foreground break-all">
                  {watchedVideoUrl || "Belum ada URL video"}
                </p>

                <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-black/5 dark:bg-zinc-900/60">
                  {embedUrl ? (
                    <div className="aspect-video w-full">
                      <iframe
                        title="Company Profile Video"
                        src={embedUrl}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full flex items-center justify-center text-center p-4 text-sm text-muted-foreground">
                      Preview embed tersedia untuk link YouTube yang valid.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/20"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending || saveMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menghapus...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Video
                    </>
                  )}
                </Button>

                <Button
                  type="submit"
                  disabled={saveMutation.isPending || deleteMutation.isPending}
                  className="bg-[#2D1B69] hover:bg-[#20134d] text-white"
                >
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
