"use client";

import { useState, useRef } from "react";
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
import { usePostData } from "@/hooks/use-post-data";

const formSchema = z.object({
  image_file: z.any().refine((file) => file instanceof File, {
    message: "Gambar wajib diunggah",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AgendaSliderCreateForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const mutation = usePostData<any, FormData>({
    url: "/activity-agenda-image-slider",
    invalidateKeys: [["agenda-slider-list"]],
    successMessage: "Slider berhasil ditambahkan",
    options: {
      onSuccess: () => {
        router.push("/dashboard/activities/sliders");
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image_file", file, { shouldValidate: true });
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append("image_url", values.image_file);
    mutation.mutate(formData);
  };

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle>Tambah Slider Agenda</CardTitle>
        <CardDescription>
          Upload gambar untuk slider agenda kegiatan.
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
                  <div className="text-center mt-3">
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
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Slider
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
