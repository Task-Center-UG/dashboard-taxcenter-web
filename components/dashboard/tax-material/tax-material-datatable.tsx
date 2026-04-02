"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/common/datatable/data-table";
import { DataTableToolbar } from "@/components/common/datatable/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { columns, TaxMaterialColumn } from "./tax-material-columns";

interface TaxMaterialResponse {
  mappedMaterials: TaxMaterialColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

export default function TaxMaterialDataTable() {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<
    Record<string, string | string[] | undefined>
  >({});

  const debouncedSearch = useDebounce(search, 500);

  const sortField = sorting[0]?.id || "";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetData<TaxMaterialResponse>({
    key: [
      "tax-material-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
    ],
    url: "/tax-material",
    params: {
      search: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
    },
  });

  const materials = data?.mappedMaterials || [];
  const pageCount = data?.paging?.total_pages || 1;

  const handleFilterChange = (
    key: string,
    value: string | string[] | undefined
  ) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const handleReset = () => {
    setSearch("");
    setFilterValues({});
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Materi Pajak
          </h2>
          <p className="text-muted-foreground">
            Kelola data materi pajak.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/tax-education/materials/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Materi
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Judul"
        searchValue={search}
        onSearchChange={setSearch}
        filters={[]}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <DataTable
        columns={columns}
        data={materials}
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
