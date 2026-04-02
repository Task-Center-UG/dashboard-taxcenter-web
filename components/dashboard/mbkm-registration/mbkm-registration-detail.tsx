"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Hash,
  FileText,
  Globe,
  Award,
  ShieldCheck,
  Calendar,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetData } from "@/hooks/use-get-data";
import { usePutData } from "@/hooks/use-put-data";
import { useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface MbkmRegistrationDetailData {
  id: number;
  full_name: string;
  class: string;
  npm: string;
  address: string;
  phone_number: string;
  email: string;
  tax_volunteer_activities: string;
  is_already_tax_volunteer: string;
  ipk: number;
  krs: string;
  transcripts: string;
  status: "PENDING" | "DITERIMA" | "DITOLAK";
  is_active: "ACTIVE" | "NON_ACTIVE";
  created_at: string;
  updated_at: string;
  region_id: number;
  major_id: number;
  Region: { id: number; name: string };
  Major: { id: number; name: string };
}

export default function MbkmRegistrationDetail({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedActive, setSelectedActive] = useState<string>("");

  const { data, isLoading } = useGetData<MbkmRegistrationDetailData>({
    key: ["mbkm-registration-detail", id],
    url: `/tax-volunteer/mbkm-registration/${id}`,
  });

  useEffect(() => {
    if (data) {
      setSelectedStatus(data.status);
      setSelectedActive(data.is_active);
    }
  }, [data]);

  const { mutate: updateData, isPending: isUpdating } = usePutData({
    url: "/tax-volunteer/mbkm-registration",
    invalidateKeys: [
      ["mbkm-registrations-list"],
      ["mbkm-registration-detail", id],
    ],
    successMessage: "Status relawan berhasil diperbarui",
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["mbkm-registration-detail", id],
        });
      },
    },
  });

  const handleSave = () => {
    updateData({
      slug: Number(id),
      data: {
        status: selectedStatus,
        is_active: selectedActive,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1B69]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center text-muted-foreground">
        Data tidak ditemukan.
      </div>
    );
  }

  const InfoRow = ({
    label,
    value,
    icon: Icon,
    isLink = false,
  }: {
    label: string;
    value: string | number | null;
    icon: any;
    isLink?: boolean;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="flex items-center gap-3 text-muted-foreground">
        <div className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {isLink && value ? (
        <a
          href={getImageUrl(String(value))}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-blue-600 hover:underline max-w-[200px] truncate"
        >
          Lihat File
        </a>
      ) : (
        <span className="text-sm font-semibold text-foreground max-w-[200px] sm:max-w-[300px] truncate text-right">
          {value || "-"}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl"
          onClick={() => router.push("/dashboard/tax-volunteers/mbkm")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-[#2D1B69] dark:text-zinc-100">
            {data.full_name}
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            NPM: {data.npm} • Program MBKM
          </p>
        </div>
      </div>

      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900 sticky top-20 z-10">
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 w-full sm:w-auto items-center gap-4">
            <div className="flex-1 sm:max-w-[200px]">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                Status Pendaftaran
              </span>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-10 w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">
                    <div className="flex items-center gap-2 text-yellow-600">
                      <Clock className="h-4 w-4" /> Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="DITERIMA">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Diterima
                    </div>
                  </SelectItem>
                  <SelectItem value="DITOLAK">
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" /> Ditolak
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 sm:max-w-[200px]">
              <span className="text-xs font-medium text-muted-foreground mb-1.5 block ml-1">
                Status Akun
              </span>
              <Select
                value={selectedActive}
                onValueChange={setSelectedActive}
                disabled={isUpdating}
              >
                <SelectTrigger className="h-10 w-full bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700">
                  <SelectValue placeholder="Keaktifan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktif</SelectItem>
                  <SelectItem value="NON_ACTIVE">Non-Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full sm:w-auto bg-[#2D1B69] hover:bg-[#1f124d] text-white font-medium h-10 px-6"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan Perubahan
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 h-fit">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-[#F58220]" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <InfoRow label="Email" value={data.email} icon={Mail} />
            <InfoRow label="No. HP" value={data.phone_number} icon={Phone} />
            <InfoRow label="Alamat" value={data.address} icon={MapPin} />
            <InfoRow
              label="Tgl Daftar"
              value={new Date(data.created_at).toLocaleDateString("id-ID", {
                dateStyle: "long",
              })}
              icon={Calendar}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 h-fit">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-[#F58220]" />
              Akademik & Relawan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <InfoRow
              label="Program Studi"
              value={data.Major.name}
              icon={BookOpen}
            />
            <InfoRow label="Kelas" value={data.class} icon={BookOpen} />
            <InfoRow label="Wilayah" value={data.Region.name} icon={Globe} />
            <InfoRow label="IPK" value={data.ipk} icon={Award} />
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Pengalaman Relawan
              </div>
              <p className="text-sm text-foreground bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg">
                {data.tax_volunteer_activities || "Tidak ada data."}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Pernah menjadi relawan sebelumnya:{" "}
                <strong>{data.is_already_tax_volunteer}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-zinc-200 dark:border-zinc-800 md:col-span-2">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#F58220]" />
              Dokumen Pendukung
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 grid sm:grid-cols-2 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">File KRS</p>
                  <p className="text-xs text-muted-foreground">
                    Kartu Rencana Studi
                  </p>
                </div>
              </div>
              {data.krs ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={getImageUrl(data.krs)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Tidak ada</span>
              )}
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Transkrip</p>
                  <p className="text-xs text-muted-foreground">
                    Transkrip Nilai
                  </p>
                </div>
              </div>
              {data.transcripts ? (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={getImageUrl(data.transcripts)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Lihat
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Tidak ada</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
