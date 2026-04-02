"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, UploadCloud, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

const updateFormSchema = z.object({
  image_file: z.any().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface AgendaSliderDetail {
  id: number;
  image_url: string;
}

export default function AgendaSliderUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: detailData, isLoading: isLoadingDetail } =
    useGetData<AgendaSliderDetail>({
      key: ["agenda-slider-detail", id],
      url: `/activity-agenda-image-slider/${id}`,
    });

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (detailData) {
      setPreviewImage(detailData.image_url);
    }
  }, [detailData]);

  const mutation = usePutData<any, FormData>({
    url: "/activity-agenda-image-slider",
    invalidateKeys: [["agenda-slider-list"], ["agenda-slider-detail", id]],
    successMessage: "Slider berhasil diperbarui",
    options: {
      onSuccess: () => {
        router.push("/dashboard/activities/sliders");
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image_file", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  const onSubmit = (values: UpdateFormValues) => {
    const formData = new FormData();
    if (values.image_file) {
      formData.append("image_url", values.image_file);
    }
    mutation.mutate({ slug: Number(id), data: formData });
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
        <CardTitle>Edit Slider Agenda</CardTitle>
        <CardDescription>
          Perbarui gambar slider agenda kegiatan.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 lg:p-8 bg-white dark:bg-zinc-950">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="image_file"
              render={() => (
                <FormItem>
                  <FormLabel>Gambar Slider</FormLabel>
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
                  <div className="text-center mt-3">
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
                  <FormMessage />
                </FormItem>
              )}
            />

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
  );
}
