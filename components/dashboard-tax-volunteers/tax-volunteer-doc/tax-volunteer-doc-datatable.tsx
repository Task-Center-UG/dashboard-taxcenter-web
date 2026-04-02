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
import { columns, TaxVolunteerDocColumn } from "./tax-volunteer-doc-columns";

interface TaxVolunteerDocResponse {
  documentations: TaxVolunteerDocColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

interface UserProfile {
  id: number;
}

export default function TaxVolunteerDocDataTable() {
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

  const { data: user } = useGetData<UserProfile>({
    key: ["user-profile"],
    url: "/users/profile",
  });

  const { data, isLoading } = useGetData<TaxVolunteerDocResponse>({
    key: [
      "tax-volunteer-doc-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
      String(user?.id),
    ],
    url: "/tax-volunteer-documentation",
    params: {
      search: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
      user_id: user?.id,
    },
    options: {
      enabled: !!user?.id,
    },
  });

  const documentations = data?.documentations || [];
  const pageCount = data?.paging?.total_pages || 1;

  const handleFilterChange = (
    key: string,
    value: string | string[] | undefined,
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
            Dokumentasi Relawan Pajak
          </h2>
          <p className="text-muted-foreground">
            Kelola data dokumentasi kegiatan relawan pajak.
          </p>
        </div>
        <Button
          onClick={() =>
            router.push("/dashboard-tax-volunteers/documentations/create")
          }
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Dokumentasi
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
        data={documentations}
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
