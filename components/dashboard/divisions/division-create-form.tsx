"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Save,
  Type,
  UploadCloud,
  ImageIcon,
  FileText,
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
import { usePostData } from "@/hooks/use-post-data";

const formSchema = z.object({
  name: z.string().min(1, "Nama divisi wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  picture_file: z.any().optional(),
  icon_file: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DivisionCreateForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = usePostData<any, FormData>({
    url: "/divisions",
    invalidateKeys: [["divisions-list"]],
    successMessage: "Divisi berhasil dibuat",
    options: {
      onSuccess: () => {
        router.push("/dashboard/organizations/divisions");
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("picture_file", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("icon_file", file);
      const objectUrl = URL.createObjectURL(file);
      setIconPreview(objectUrl);
    }
  };

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.picture_file) {
      formData.append("picture_url", values.picture_file);
    }
    if (values.icon_file) {
      formData.append("icon_url", values.icon_file);
    }

    mutation.mutate(formData);
  };

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle>Tambah Divisi Baru</CardTitle>
        <CardDescription>
          Isi formulir di bawah ini untuk menambahkan divisi baru.
        </CardDescription>
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
                  {previewImage ? (
                    <img
                      src={previewImage}
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
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 rounded-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-3 h-3 mr-2" />
                    Pilih Gambar
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider">
                    JPG, PNG (Max 2MB)
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <div className="w-full border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Icon Divisi
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Cari atau unduh icon dari{" "}
                    <a
                      href="https://lucide.dev/icons/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2D1B69] dark:text-[#F58220] font-semibold hover:underline"
                    >
                      lucide.dev/icons
                    </a>{" "}
                    lalu upload di sini.
                  </p>
                  <div
                    className="relative group cursor-pointer w-full h-36 rounded-xl overflow-hidden border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#2D1B69] transition-colors"
                    onClick={() => iconInputRef.current?.click()}
                  >
                    {iconPreview ? (
                      <img
                        src={iconPreview}
                        alt="Icon Preview"
                        className="w-full h-full object-contain bg-zinc-50 dark:bg-zinc-900 p-3"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs">Klik untuk upload icon</span>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 rounded-xl w-full"
                    onClick={() => iconInputRef.current?.click()}
                  >
                    <UploadCloud className="w-3 h-3 mr-2" />
                    Pilih Icon
                  </Button>
                  <input
                    type="file"
                    ref={iconInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleIconChange}
                  />
                </div>
              </div>

              <div className="p-8 md:w-2/3 space-y-6 bg-white dark:bg-zinc-950">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Divisi</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Masukkan nama divisi"
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
                              placeholder="Masukkan deskripsi divisi"
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

                <div className="flex justify-end gap-3 pt-4">
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
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Divisi
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
