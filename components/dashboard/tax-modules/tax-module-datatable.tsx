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
import { columns, TaxModuleColumn } from "./tax-module-columns";

interface TaxModulesResponse {
  taxModules: TaxModuleColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

export default function TaxModuleDataTable() {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const sortField = sorting[0]?.id || "";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetData<TaxModulesResponse>({
    key: [
      "tax-modules-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
    ],
    url: "/tax-module",
    params: {
      search: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
    },
  });

  const taxModules = data?.taxModules || [];
  const pageCount = data?.paging?.total_pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Manajemen Modul Pajak
          </h2>
          <p className="text-muted-foreground">
            Kelola modul-modul untuk relawan pajak.
          </p>
        </div>
        <Button
          onClick={() =>
            router.push("/dashboard/tax-volunteers/modules/create")
          }
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Modul
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Judul Modul"
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
        data={taxModules}
        pageCount={pageCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
      />
    </div>
  );
}
