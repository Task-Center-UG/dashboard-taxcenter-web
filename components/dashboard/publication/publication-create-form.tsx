"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, Type, Calendar } from "lucide-react";
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
import { usePostData } from "@/hooks/use-post-data";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";

const createFormSchema = z.object({
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  year: z
    .number({ message: "Tahun harus berupa angka" })
    .min(2000, "Tahun minimal 2000")
    .max(2100, "Tahun maksimal 2100"),
});

type CreateFormValues = z.infer<typeof createFormSchema>;

export default function PublicationCreateForm() {
  const router = useRouter();
  const [editorContent, setEditorContent] = useState<Content>("");

  const form = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      title: "",
      description: "",
      year: new Date().getFullYear(),
    },
  });

  const mutation = usePostData<any, any>({
    url: "/publication",
    invalidateKeys: [["publication-list"]],
    successMessage: "Publikasi berhasil ditambahkan",
    options: {
      onSuccess: () => {
        router.push("/dashboard/activities/publications");
      },
    },
  });

  const onSubmit = (values: CreateFormValues) => {
    mutation.mutate({
      title: values.title,
      description: values.description,
      year: values.year,
    });
  };

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle>Tambah Publikasi</CardTitle>
        <CardDescription>
          Isi formulir di bawah untuk menambahkan publikasi baru.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 lg:p-8 space-y-6 bg-white dark:bg-zinc-950">
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
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tahun</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="Masukkan tahun..."
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
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Data
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
