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
import { usePatchData } from "@/hooks/use-patch-data";
import { useGetData } from "@/hooks/use-get-data";
import { getImageUrl } from "@/lib/utils";

const updateFormSchema = z.object({
  name: z.string().min(1, "Nama divisi wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  picture_file: z.any().optional(),
  icon_file: z.any().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface DivisionDetail {
  id: number;
  name: string;
  picture_url: string;
  icon_url?: string | null;
  description: string;
  created_at: string;
  updated_at: string;
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

export default function DivisionUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);

  const { data: divisionData, isLoading: isLoadingDivision } =
    useGetData<DivisionDetail>({
      key: ["division-detail", id],
      url: `/divisions/${id}`,
    });

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (divisionData) {
      form.reset({
        name: divisionData.name,
        description: divisionData.description,
      });
      setPreviewImage(divisionData.picture_url);
      setPreviewIcon(divisionData.icon_url ?? null);
    }
  }, [divisionData, form]);

  const mutation = usePatchData<any, FormData>({
    url: "/divisions",
    invalidateKeys: [["divisions-list"], ["division-detail", id]],
    successMessage: "Divisi berhasil diperbarui",
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
      setPreviewIcon(objectUrl);
    }
  };

  const onSubmit = (values: UpdateFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.picture_file) {
      formData.append("picture_url", values.picture_file);
    }
    if (values.icon_file) {
      formData.append("icon_url", values.icon_file);
    }

    mutation.mutate({ slug: id, data: formData });
  };

  if (isLoadingDivision) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle>Edit Divisi</CardTitle>
        <CardDescription>Perbarui informasi divisi.</CardDescription>
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
                <div className="text-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-xl"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud className="w-3 h-3 mr-2" /> Ubah Gambar
                  </Button>
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
                    {previewIcon ? (
                      <img
                        src={getImageUrl(previewIcon)}
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
                    className="h-8 rounded-xl w-full"
                    onClick={() => iconInputRef.current?.click()}
                  >
                    <UploadCloud className="w-3 h-3 mr-2" /> Ubah Icon
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
