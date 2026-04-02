"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Type, MapPin, CalendarIcon, UploadCloud, Trash2, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";
import { usePostData } from "@/hooks/use-post-data";
import { useDeleteData } from "@/hooks/use-delete-data";
import { getImageUrl } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const updateFormSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  date: z.string().optional(),
  location: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface DocFile {
  id: number;
  file_url: string;
  created_at: string;
  updated_at: string;
  tax_volunteer_documentation_id: number;
}

interface TaxVolunteerDocDetailData {
  id: number;
  title: string;
  date: string;
  location: string;
  create_tax_volunteer_documentation_file: DocFile[];
}

export default function TaxVolunteerDocUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: "",
      date: "",
      location: "",
    },
  });

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetData<TaxVolunteerDocDetailData>({
      key: ["tax-volunteer-doc-detail", id],
      url: `/tax-volunteer-documentation/${id}`,
    });

  useEffect(() => {
    if (detailData) {
      form.reset({
        title: detailData.title || "",
        date: detailData.date ? detailData.date.split("T")[0] : "",
        location: detailData.location || "",
      });
    }
  }, [detailData, form]);

  const mutation = usePutData<any, Record<string, any>>({
    url: "/tax-volunteer-documentation",
    invalidateKeys: [["tax-volunteer-doc-list"], ["tax-volunteer-doc-detail", id]],
    successMessage: "Data berhasil diperbarui",
    options: {
      onSuccess: () => {
        router.push("/dashboard/tax-volunteers/documentations");
      },
    },
  });

  const uploadFileMutation = usePostData<any, FormData>({
    url: `/tax-volunteer-documentation/${id}/file`,
    invalidateKeys: [["tax-volunteer-doc-detail", id]],
    successMessage: "File berhasil diunggah",
    options: {
      onSuccess: () => {
        setIsUploadingFile(false);
        queryClient.invalidateQueries({ queryKey: ["tax-volunteer-doc-detail", id] });
      },
      onError: () => {
        setIsUploadingFile(false);
      },
    },
  });

  const deleteFileMutation = useDeleteData({
    url: "/tax-volunteer-documentation/file",
    invalidateKeys: [["tax-volunteer-doc-detail", id]],
    successMessage: "File berhasil dihapus",
  });

  const onSubmit = (values: UpdateFormValues) => {
    const payload: Record<string, any> = {
      title: values.title,
    };
    if (values.date) {
      payload.date = values.date;
    }
    if (values.location) {
      payload.location = values.location;
    }

    mutation.mutate({ slug: Number(id), data: payload });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingFile(true);
      const formData = new FormData();
      formData.append("file_url", file);
      uploadFileMutation.mutate(formData);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteFile = (fileId: number) => {
    deleteFileMutation.mutate(fileId.toString());
  };

  const files = detailData?.create_tax_volunteer_documentation_file || [];

  if (isLoadingDetail) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle>Edit Dokumentasi</CardTitle>
          <CardDescription>
            Perbarui data dokumentasi di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 lg:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Masukkan judul..."
                            className="pl-9 h-11 rounded-xl bg-zinc-50/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal (Opsional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            className="pl-9 h-11 rounded-xl bg-zinc-50/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokasi (Opsional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Masukkan lokasi..."
                            className="pl-9 h-11 rounded-xl bg-zinc-50/50"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 px-6 rounded-xl"
                  onClick={() => router.back()}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="bg-[#2D1B69] hover:bg-[#20134d] text-white min-w-[150px] h-11 rounded-xl shadow-lg shadow-[#2D1B69]/10 transition-all"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>File Dokumentasi</CardTitle>
              <CardDescription>
                Kelola file dokumentasi yang diunggah.
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingFile}
            >
              {isUploadingFile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleFileUpload}
          />

          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-3" />
              <p className="text-sm">Belum ada file yang diunggah</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
                >
                  <img
                    src={getImageUrl(file.file_url)}
                    alt="Dokumentasi"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={deleteFileMutation.isPending}
                    >
                      {deleteFileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
