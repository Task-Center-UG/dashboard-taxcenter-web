"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Type, UploadCloud, ImageIcon } from "lucide-react";
import type { Content } from "@tiptap/react";

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
import { getImageUrl } from "@/lib/utils";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { SearchableSelect } from "@/components/common/searchable-select";

const categoryLabels: Record<string, string> = {
  SPT_ASSISTANT: "Asistensi SPT",
  PUBLIC_RELATIONS_FUNCTION: "Fungsi Humas",
  SUPPORTING_ACTIVITIES: "Kegiatan Pendukung",
  BUSINESS_DEVELOPMENT_SERVICES: "Layanan Pengembangan Usaha",
};

const updateFormSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  image_url: z.union([z.instanceof(File), z.string()]).optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface TaxVolunteerActivityDetailData {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
}

interface CategoryResponse {
  taxVolunteerActivitiesCategory: string[];
}

export default function TaxVolunteerActivityUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<Content>("");

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
    },
  });

  const { data: categoryData } = useGetData<CategoryResponse>({
    key: ["tax-volunteer-activity-categories"],
    url: "/tax-volunteer-activities/category",
  });

  const categories = categoryData?.taxVolunteerActivitiesCategory || [];

  const categoryOptions = categories.map((cat) => ({
    label: categoryLabels[cat] || cat,
    value: cat,
  }));

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetData<TaxVolunteerActivityDetailData>({
      key: ["tax-volunteer-activity-detail", id],
      url: `/tax-volunteer-activities/${id}`,
    });

  useEffect(() => {
    if (detailData) {
      form.reset({
        title: detailData.title || "",
        description: detailData.description || "",
        category: detailData.category || "",
      });
      setEditorContent(detailData.description || "");
      if (detailData.image_url) {
        setPreviewImage(detailData.image_url);
      }
    }
  }, [detailData, form]);

  const mutation = usePutData<any, FormData>({
    url: "/tax-volunteer-activities",
    invalidateKeys: [["tax-volunteer-activity-list"], ["tax-volunteer-activity-detail", id]],
    successMessage: "Data berhasil diperbarui",
    options: {
      onSuccess: () => {
        router.push("/dashboard/tax-volunteers/activities");
      },
    },
  });

  const onSubmit = (values: UpdateFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("category", values.category);

    if (values.image_url instanceof File) {
      formData.append("image_url", values.image_url);
    }

    mutation.mutate({ slug: Number(id), data: formData });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image_url", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
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
        <CardTitle>Edit Kegiatan Relawan Pajak</CardTitle>
        <CardDescription>
          Perbarui data kegiatan relawan pajak di bawah ini.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-zinc-100 dark:divide-zinc-800">
              <div className="p-6 lg:p-8 flex flex-col items-center space-y-4 bg-white dark:bg-zinc-950">
                <div
                  className="relative group cursor-pointer w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#F58220] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <img
                      src={getImageUrl(previewImage)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm">Klik untuk upload gambar</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                    <UploadCloud className="w-10 h-10 text-white drop-shadow-md" />
                  </div>
                </div>
                <div className="text-center w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 rounded-xl w-full sm:w-auto"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-3 h-3 mr-2" /> Ubah Gambar
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                    JPG, PNG, WEBP (Max 2MB)
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleFileChange}
                />
              </div>

              <div className="p-6 lg:p-8 lg:col-span-2 space-y-6 bg-white dark:bg-zinc-950 min-w-0">
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={categoryOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Pilih kategori..."
                            searchPlaceholder="Cari kategori..."
                            emptyMessage="Kategori tidak ditemukan."
                          />
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
                          <div className="w-full max-w-full overflow-hidden">
                            <MinimalTiptapEditor
                              value={editorContent}
                              onChange={(value) => {
                                setEditorContent(value);
                                const htmlStr =
                                  typeof value === "string" ? value : "";
                                field.onChange(htmlStr);
                              }}
                              className="w-full rounded-xl bg-zinc-50/50"
                              editorContentClassName="p-5"
                              output="html"
                              placeholder="Masukkan deskripsi..."
                              autofocus={false}
                              editable={true}
                              editorClassName="focus:outline-hidden"
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
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
