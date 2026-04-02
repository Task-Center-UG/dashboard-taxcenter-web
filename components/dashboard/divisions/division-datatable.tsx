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
import { columns, DivisionColumn } from "./division-columns";

interface DivisionsResponse {
  divisions: DivisionColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

export default function DivisionDataTable() {
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

  const { data, isLoading } = useGetData<DivisionsResponse>({
    key: [
      "divisions-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
    ],
    url: "/divisions",
    params: {
      search: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
    },
  });

  const divisions = data?.divisions || [];
  const pageCount = data?.paging?.total_pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Manajemen Divisi
          </h2>
          <p className="text-muted-foreground">
            Kelola data divisi yang ada di Tax Center.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/organizations/divisions/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Divisi
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Nama Divisi"
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
        data={divisions}
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
