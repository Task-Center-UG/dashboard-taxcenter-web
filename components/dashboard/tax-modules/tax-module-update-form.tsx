"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Save,
  Type,
  UploadCloud,
  FileText,
  FileUp,
  Tag,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";

const updateFormSchema = z.object({
  title: z.string().min(1, "Judul modul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  file: z.any().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface TaxModuleDetail {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  updated_by_id: number;
  created_by: {
    id: number;
    username: string;
    full_name: string;
  };
  updated_by: {
    id: number;
    username: string;
    full_name: string;
  };
}

export default function TaxModuleUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetData<TaxModuleDetail>({
      key: ["tax-module-detail", id],
      url: `/tax-module/${id}`,
    });

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  useEffect(() => {
    if (detailData) {
      form.reset({
        title: detailData.title,
        description: detailData.description,
        category: detailData.category,
      });
      if (detailData.file_url) {
        const parts = detailData.file_url.split("/");
        setFileName(parts[parts.length - 1]);
      }
    }
  }, [detailData, form]);

  const mutation = usePutData<any, FormData>({
    url: "/tax-module",
    invalidateKeys: [["tax-modules-list"], ["tax-module-detail", id]],
    successMessage: "Modul berhasil diperbarui",
    options: {
      onSuccess: () => {
        router.push("/dashboard/tax-volunteers/modules");
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      setFileName(file.name);
    }
  };

  const onSubmit = (values: UpdateFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);

    if (values.file) {
      formData.append("file_url", values.file);
    }

    mutation.mutate({ slug: id, data: formData });
  };

  if (isLoadingDetail) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle>Edit Modul</CardTitle>
        <CardDescription>Perbarui informasi modul.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
              <div className="p-8 md:w-1/3 flex flex-col items-center space-y-4 bg-white dark:bg-zinc-950">
                <div
                  className="relative group cursor-pointer w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#F58220] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    {fileName ? (
                      <>
                        <FileUp className="w-12 h-12 mb-2 text-[#2D1B69]" />
                        <span className="text-sm text-center px-4 font-medium text-foreground">
                          {fileName}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          Klik untuk ganti file
                        </span>
                      </>
                    ) : (
                      <>
                        <FileUp className="w-12 h-12 mb-2" />
                        <span className="text-sm">Klik untuk upload file</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <UploadCloud className="w-10 h-10 text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-3 h-3 mr-2" /> Ubah File
                  </Button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>

              <div className="p-8 md:w-2/3 space-y-6 bg-white dark:bg-zinc-950">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Judul Modul</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Textarea
                              className="pl-9 min-h-[120px] rounded-xl bg-zinc-50/50 resize-none"
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
                    className="bg-[#2D1B69] hover:bg-[#20134d] text-white min-w-[150px] h-11 rounded-xl"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
