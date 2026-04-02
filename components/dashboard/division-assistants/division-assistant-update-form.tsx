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
  Building2,
  GraduationCap,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { usePatchData } from "@/hooks/use-patch-data";
import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { getImageUrl } from "@/lib/utils";
import { SearchableSelect } from "@/components/common/searchable-select";

const updateFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  division_id: z.string().min(1, "Divisi wajib dipilih"),
  major_id: z.string().min(1, "Program studi wajib dipilih"),
  picture_file: z.any().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface DivisionAssistantDetail {
  id: number;
  name: string;
  picture_url: string;
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
  Division: {
    id: number;
    name: string;
  };
  Major: {
    id: number;
    name: string;
  };
}

interface DivisionOption {
  id: number;
  name: string;
}

interface MajorOption {
  id: number;
  name: string;
}

export default function DivisionAssistantUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [divisionSearch, setDivisionSearch] = useState("");

  const debouncedDivisionSearch = useDebounce(divisionSearch, 500);

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetData<DivisionAssistantDetail>({
      key: ["division-assistant-detail", id],
      url: `/division-assistants/${id}`,
    });

  const { data: divisionsData, isLoading: isLoadingDivisions } = useGetData<any>({
    key: ["divisions-search", debouncedDivisionSearch],
    url: "/divisions",
    params: {
      search: debouncedDivisionSearch || undefined,
      size: 20,
    },
  });

  const { data: majorsData, isLoading: isLoadingMajors } = useGetData<MajorOption[]>({
    key: ["majors-all"],
    url: "/majors",
  });

  const rawDivisions: DivisionOption[] = Array.isArray(divisionsData)
    ? divisionsData
    : divisionsData?.divisions || [];

  const divisionOptions = (() => {
    const list = rawDivisions.map((d) => ({
      label: d.name,
      value: String(d.id),
    }));
    if (
      detailData?.Division &&
      !list.find((o) => o.value === String(detailData.Division.id))
    ) {
      list.unshift({
        label: detailData.Division.name,
        value: String(detailData.Division.id),
      });
    }
    return list;
  })();

  const majorOptions = (Array.isArray(majorsData) ? majorsData : []).map(
    (m: MajorOption) => ({
      label: m.name,
      value: String(m.id),
    })
  );

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      name: "",
      division_id: "",
      major_id: "",
    },
  });

  useEffect(() => {
    if (detailData) {
      form.reset({
        name: detailData.name,
        division_id: String(detailData.Division?.id || ""),
        major_id: String(detailData.Major?.id || ""),
      });
      setPreviewImage(detailData.picture_url);
    }
  }, [detailData, form]);

  const mutation = usePatchData<any, FormData>({
    url: "/division-assistants",
    invalidateKeys: [
      ["division-assistants-list"],
      ["division-assistant-detail", id],
    ],
    successMessage: "Asisten divisi berhasil diperbarui",
    options: {
      onSuccess: () => {
        router.push("/dashboard/organizations/division-assistants");
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

  const onSubmit = (values: UpdateFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("division_id", values.division_id);
    formData.append("major_id", values.major_id);

    if (values.picture_file) {
      formData.append("picture_url", values.picture_file);
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
        <CardTitle>Edit Asisten Divisi</CardTitle>
        <CardDescription>
          Perbarui informasi asisten divisi.
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
              </div>

              <div className="p-8 md:w-2/3 space-y-6 bg-white dark:bg-zinc-950">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama</FormLabel>
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
                    name="division_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          Divisi
                        </FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={divisionOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Pilih divisi..."
                            searchPlaceholder="Cari divisi..."
                            emptyMessage="Divisi tidak ditemukan."
                            isLoading={isLoadingDivisions}
                            onSearchChange={setDivisionSearch}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="major_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          Program Studi
                        </FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={majorOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Pilih program studi..."
                            searchPlaceholder="Cari program studi..."
                            emptyMessage="Program studi tidak ditemukan."
                            isLoading={isLoadingMajors}
                          />
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
