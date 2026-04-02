"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Loader2,
  Save,
  User,
  Mail,
  AtSign,
  UploadCloud,
  ShieldCheck,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePatchData } from "@/hooks/use-patch-data";
import { useGetData } from "@/hooks/use-get-data";
import { getImageUrl } from "@/lib/utils";

const updateFormSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  full_name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  role_id: z.string().min(1, "Role wajib dipilih"),
  picture_file: z.any().optional(),
});

type UpdateFormValues = z.infer<typeof updateFormSchema>;

interface UserDetail {
  id: number;
  username: string;
  full_name: string;
  email: string;
  picture_url: string | null;
  role: {
    id: number;
    name: string;
  };
}

export default function UserUpdateForm({ id }: { id: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: roles } = useGetData<any[]>({
    key: ["master-roles"],
    url: "/master/role",
  });

  const { data: userData, isLoading: isLoadingUser } = useGetData<UserDetail>({
    key: ["user-detail", id],
    url: `/users/${id}`,
  });

  const form = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
      role_id: "",
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        username: userData.username,
        full_name: userData.full_name,
        email: userData.email,
        role_id: userData.role.id.toString(),
      });
      setPreviewImage(userData.picture_url);
    }
  }, [userData, form]);

  const mutation = usePatchData<any, FormData>({
    url: "/users",
    invalidateKeys: [["users-list"], ["user-detail", id]],
    successMessage: "User berhasil diperbarui",
    options: {
      onSuccess: () => {
        router.push("/dashboard/users");
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
    formData.append("username", values.username);
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("role_id", values.role_id);

    if (values.picture_file) {
      formData.append("picture_url", values.picture_file);
    }

    mutation.mutate({ slug: id, data: formData });
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  return (
    <Card className="max-w-7xl mx-auto border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle>Edit User</CardTitle>
        <CardDescription>Perbarui informasi akun pengguna.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
              <div className="p-8 md:w-1/3 flex flex-col items-center space-y-4 bg-white dark:bg-zinc-950">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Avatar className="w-40 h-40 border-4 border-white dark:border-zinc-900 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 transition-all group-hover:ring-[#F58220]">
                    <AvatarImage
                      src={getImageUrl(previewImage)}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[#2D1B69] text-white text-4xl font-bold">
                      {userData?.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Camera className="w-10 h-10 text-white" />
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
                    <UploadCloud className="w-3 h-3 mr-2" /> Ubah Foto
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
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                  </div>

                  <FormField
                    control={form.control}
                    name="role_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role / Hak Akses</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <div className="relative">
                              <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                              <SelectTrigger className="pl-9 h-11 rounded-xl bg-zinc-50/50">
                                <SelectValue placeholder="Pilih Role" />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent className="rounded-xl">
                            {roles?.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.id.toString()}
                              >
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
