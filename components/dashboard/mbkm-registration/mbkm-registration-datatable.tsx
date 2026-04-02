"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/common/datatable/data-table";
import { DataTableToolbar } from "@/components/common/datatable/data-table-toolbar";
import { columns, MbkmRegistrationColumn } from "./mbkm-registration-columns";

interface MbkmRegistrationsResponse {
  registrations: MbkmRegistrationColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

export default function MbkmRegistrationDataTable() {
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

  const statusFilter = filterValues["status"];
  const statusValue = Array.isArray(statusFilter)
    ? statusFilter[0]
    : statusFilter;

  const { data, isLoading } = useGetData<MbkmRegistrationsResponse>({
    key: [
      "mbkm-registrations-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
      statusValue || "",
    ],
    url: "/tax-volunteer/mbkm-registration",
    params: {
      search: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
      status: statusValue || undefined,
    },
  });

  const registrations = data?.registrations || [];
  const pageCount = data?.paging?.total_pages || 1;

  const statusFilterOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Diterima", value: "DITERIMA" },
    { label: "Ditolak", value: "DITOLAK" },
  ];

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
          Relawan Pajak MBKM
        </h2>
        <p className="text-muted-foreground">
          Kelola pendaftaran relawan pajak program MBKM.
        </p>
      </div>

      <DataTableToolbar
        searchKey="Nama / NPM"
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "status",
            title: "Status",
            options: statusFilterOptions,
          },
        ]}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <DataTable
        columns={columns}
        data={registrations}
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
