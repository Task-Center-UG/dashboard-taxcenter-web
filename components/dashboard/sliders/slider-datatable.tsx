"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/datatable/data-table";
import { DataTableToolbar } from "@/components/common/datatable/data-table-toolbar";
import { columns } from "./slider-columns";

export default function SliderDataTable() {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const sortField = sorting[0]?.id || "created_at";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetData<any[]>({
    key: [
      "sliders-list",
      sortField,
      sortOrder,
      debouncedSearch,
    ],
    url: "/cms/sliders",
    params: {
      title: debouncedSearch || undefined,
      sort_by: sortField,
      order: sortOrder,
    },
  });

  const sliders = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Manajemen Slider
          </h2>
          <p className="text-muted-foreground">
            Kelola data slider/banner yang tampil di halaman utama website.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/home/sliders/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Slider
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Judul"
        searchValue={search}
        onSearchChange={setSearch}
        filters={[]}
        filterValues={{}}
        onFilterChange={() => {}}
        onReset={() => {
          setSearch("");
        }}
      />

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
