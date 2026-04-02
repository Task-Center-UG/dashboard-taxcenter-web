"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Camera,
  Loader2,
  Save,
  User,
  Mail,
  UploadCloud,
  AtSign,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Hash,
  Phone,
  MapPin,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useGetData } from "@/hooks/use-get-data";
import { usePatchData } from "@/hooks/use-patch-data";
import { usePutData } from "@/hooks/use-put-data";
import { getImageUrl } from "@/lib/utils";

interface VolunteerRegistration {
  id: number;
  full_name: string;
  npm: string;
  class: string;
  phone_number: string;
  address: string;
  status: string;
  is_active: string;
}

interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  email: string;
  picture_url: string | null;
  role: {
    id: number;
    name: string;
  };
  mbkm_registration?: VolunteerRegistration | null;
  non_mbkm_registration?: VolunteerRegistration | null;
}

const profileFormSchema = z.object({
  username: z.string().min(2, "Username minimal 2 karakter"),
  full_name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  picture_file: z.any().optional(),
});

const passwordFormSchema = z
  .object({
    new_password: z.string().min(8, "Password minimal 8 karakter"),
    confirm_password: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Password tidak cocok",
    path: ["confirm_password"],
  });

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function ProfileForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data: user, isLoading: isLoadingUser } = useGetData<UserProfile>({
    key: ["user-profile"],
    url: "/users/profile",
  });

  const profileMutation = usePatchData<any, FormData>({
    url: "/users/profile",
    invalidateKeys: [["user-profile"]],
    successMessage: "Profil berhasil diperbarui",
  });

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username,
        full_name: user.full_name,
        email: user.email,
      });
      setPreviewImage(user.picture_url);
    }
  }, [user, profileForm]);

  const onProfileSubmit = (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);

    if (values.picture_file) {
      formData.append("picture_url", values.picture_file);
    }

    profileMutation.mutate({ data: formData });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      profileForm.setValue("picture_file", file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };

  const passwordMutation = usePutData<any, { new_password: string }>({
    url: "/users/change-password",
    successMessage: "Kata sandi berhasil diubah",
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  const onPasswordSubmit = (values: PasswordFormValues) => {
    passwordMutation.mutate(
      { data: { new_password: values.new_password } },
      {
        onSuccess: () => {
          passwordForm.reset();
        },
      },
    );
  };

  if (isLoadingUser) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const registrationData =
    user?.mbkm_registration || user?.non_mbkm_registration;
  const registrationType = user?.mbkm_registration ? "MBKM" : "Non-MBKM";

  const InfoRow = ({ icon: Icon, label, value, children }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-muted-foreground">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <div className="text-sm font-semibold text-foreground text-right">
        {children ? children : value || "-"}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12 px-4 md:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
          Pengaturan Akun
        </h1>
        <p className="text-muted-foreground">
          Kelola informasi profil dan keamanan akun Anda.
        </p>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle>Profil Saya</CardTitle>
          <CardDescription>Informasi umum akun pengguna Anda.</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
              <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-zinc-800">
                <div className="p-8 md:w-1/3 flex flex-col items-center space-y-4 bg-white dark:bg-zinc-950">
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Avatar className="w-40 h-40 border-4 border-white dark:border-zinc-900 shadow-lg ring-1 ring-zinc-200 dark:ring-zinc-800 transition-all group-hover:ring-[#F58220] group-hover:ring-2">
                      <AvatarImage
                        src={getImageUrl(previewImage)}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-4xl bg-[#2D1B69] text-white font-bold">
                        {user?.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      <Camera className="w-10 h-10 text-white drop-shadow-md" />
                    </div>
                  </div>

                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="w-3 h-3 mr-2" />
                      Ubah Foto
                    </Button>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
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
                </div>

                <div className="p-8 md:w-2/3 space-y-6 bg-white dark:bg-zinc-950">
                  <div className="grid gap-6">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-9 h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-[#2D1B69]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <AtSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="email"
                                className="pl-9 h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-[#2D1B69]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-9 h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-[#2D1B69]"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileMutation.isPending}
                      className="bg-[#2D1B69] hover:bg-[#20134d] text-white min-w-[150px] h-11 shadow-lg shadow-[#2D1B69]/10"
                    >
                      {profileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Simpan Profil
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

      {registrationData && (
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[#2D1B69] dark:text-zinc-100" />
                  Data Relawan
                </CardTitle>
                <CardDescription>
                  Informasi pendaftaran program {registrationType}.
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-zinc-300 dark:border-zinc-700"
              >
                {registrationType}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white dark:bg-zinc-950">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="px-8 py-2">
                <InfoRow icon={Hash} label="NPM" value={registrationData.npm} />
                <InfoRow
                  icon={BookOpen}
                  label="Kelas"
                  value={registrationData.class}
                />
                <InfoRow
                  icon={Phone}
                  label="No. Telepon"
                  value={registrationData.phone_number}
                />
              </div>
              <div className="px-8 py-2">
                <InfoRow
                  icon={MapPin}
                  label="Alamat"
                  value={registrationData.address}
                />
                <InfoRow icon={Activity} label="Status">
                  <div className="flex gap-2 justify-end">
                    <Badge
                      className={
                        registrationData.status === "DITERIMA"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                          : registrationData.status === "DITOLAK"
                            ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }
                    >
                      {registrationData.status === "DITERIMA" && (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      )}
                      {registrationData.status === "DITOLAK" && (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {registrationData.status === "PENDING" && (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {registrationData.status}
                    </Badge>
                  </div>
                </InfoRow>
                <InfoRow icon={User} label="Keaktifan">
                  <Badge
                    variant="outline"
                    className={
                      registrationData.is_active === "ACTIVE"
                        ? "border-green-200 text-green-700 bg-green-50 dark:bg-green-900/10 dark:text-green-400 dark:border-green-900"
                        : "border-zinc-200 text-zinc-500 bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400"
                    }
                  >
                    {registrationData.is_active === "ACTIVE"
                      ? "Aktif"
                      : "Tidak Aktif"}
                  </Badge>
                </InfoRow>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#2D1B69] dark:text-white" /> Keamanan
            Akun
          </CardTitle>
          <CardDescription>
            Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-white dark:bg-zinc-950">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={passwordForm.control}
                    name="new_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kata Sandi Baru</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#2D1B69]" />
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Minimal 8 karakter"
                              className="pl-9 pr-10 h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-[#2D1B69]"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Konfirmasi Kata Sandi</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#2D1B69]" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Ulangi kata sandi baru"
                              className="pl-9 pr-10 h-11 bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-[#2D1B69]"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={passwordMutation.isPending}
                    variant="outline"
                    className="border-[#2D1B69] text-[#2D1B69] hover:bg-[#2D1B69] dark:text-white hover:text-white min-w-[150px] h-11 transition-all"
                  >
                    {passwordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Ganti Kata Sandi
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
