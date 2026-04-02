"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { useGetData } from "@/hooks/use-get-data";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/datatable/data-table";
import { columns } from "./agenda-slider-columns";

export default function AgendaSliderDataTable() {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortField = sorting[0]?.id || "";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetData<any[]>({
    key: ["agenda-slider-list", sortField, sortOrder],
    url: "/activity-agenda-image-slider",
    params: {
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
    },
  });

  const sliders = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Slider Agenda Kegiatan
          </h2>
          <p className="text-muted-foreground">
            Kelola gambar slider untuk halaman agenda kegiatan.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/activities/sliders/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Slider
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={sliders}
        pageCount={1}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
      />
    </div>
  );
}
