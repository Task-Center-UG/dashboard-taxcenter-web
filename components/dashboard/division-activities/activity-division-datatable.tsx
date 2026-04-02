"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Plus, ArrowLeft } from "lucide-react";

import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/datatable/data-table";
import { DataTableToolbar } from "@/components/common/datatable/data-table-toolbar";
import {
  columns,
  ActivityDivisionColumn,
} from "./activity-division-columns";

interface ActivityDivisionsResponse {
  activityDivisons: ActivityDivisionColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

interface DivisionDetail {
  id: number;
  name: string;
}

export default function ActivityDivisionDataTable({
  divisionId,
}: {
  divisionId: string;
}) {
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

  const { data: divisionData } = useGetData<DivisionDetail>({
    key: ["division-detail", divisionId],
    url: `/divisions/${divisionId}`,
  });

  const { data, isLoading } = useGetData<ActivityDivisionsResponse>({
    key: [
      "activity-divisions-list",
      divisionId,
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
    ],
    url: "/activity-divisions",
    params: {
      division_id: divisionId,
      search: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
    },
  });

  const activities = data?.activityDivisons || [];
  const pageCount = data?.paging?.total_pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl mt-1 shrink-0"
            onClick={() => router.push("/dashboard/organizations/divisions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
              Kegiatan {divisionData?.name || "Divisi"}
            </h2>
            <p className="text-muted-foreground">
              Kelola kegiatan untuk divisi ini.
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            router.push(
              `/dashboard/organizations/divisions/${divisionId}/division-activities/create`
            )
          }
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Kegiatan
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Judul Kegiatan"
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
        data={activities}
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
