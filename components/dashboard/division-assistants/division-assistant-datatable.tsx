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
import { columns, DivisionAssistantColumn } from "./division-assistant-columns";

interface DivisionAssistantsResponse {
  divisionAssistants: DivisionAssistantColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

interface DivisionOption {
  id: number;
  name: string;
}

interface MajorOption {
  id: number;
  name: string;
}

export default function DivisionAssistantDataTable() {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState<
    string | string[] | undefined
  >();
  const [majorFilter, setMajorFilter] = useState<
    string | string[] | undefined
  >();

  const debouncedSearch = useDebounce(search, 500);

  const sortField = sorting[0]?.id || "";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data: divisionsData } = useGetData<DivisionOption[]>({
    key: ["divisions-filter-options"],
    url: "/divisions",
    params: { size: 100 },
  });

  const { data: majorsData } = useGetData<MajorOption[]>({
    key: ["majors-filter-options"],
    url: "/majors",
  });

  const divisionFilterOptions = (
    Array.isArray(divisionsData)
      ? divisionsData
      : (divisionsData as any)?.divisions || []
  ).map((d: DivisionOption) => ({
    label: d.name,
    value: String(d.id),
  }));

  const majorFilterOptions = (Array.isArray(majorsData) ? majorsData : []).map(
    (m: MajorOption) => ({
      label: m.name,
      value: String(m.id),
    })
  );

  const selectedDivisionId = Array.isArray(divisionFilter)
    ? divisionFilter[0]
    : divisionFilter;
  const selectedMajorId = Array.isArray(majorFilter)
    ? majorFilter[0]
    : majorFilter;

  const { data, isLoading } = useGetData<DivisionAssistantsResponse>({
    key: [
      "division-assistants-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
      selectedDivisionId || "",
      selectedMajorId || "",
    ],
    url: "/division-assistants",
    params: {
      name: debouncedSearch || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
      division_id: selectedDivisionId || undefined,
      major_id: selectedMajorId || undefined,
    },
  });

  const divisionAssistants = data?.divisionAssistants || [];
  const pageCount = data?.paging?.total_pages || 1;

  const handleFilterChange = (
    key: string,
    value: string | string[] | undefined
  ) => {
    if (key === "division") {
      setDivisionFilter(value);
    } else if (key === "major") {
      setMajorFilter(value);
    }
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Manajemen Asisten Divisi
          </h2>
          <p className="text-muted-foreground">
            Kelola data asisten divisi yang ada di Tax Center.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/organizations/division-assistants/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah Asisten Divisi
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Nama"
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "division",
            title: "Divisi",
            options: divisionFilterOptions,
          },
          {
            key: "major",
            title: "Program Studi",
            options: majorFilterOptions,
          },
        ]}
        filterValues={{
          division: divisionFilter,
          major: majorFilter,
        }}
        onFilterChange={handleFilterChange}
        onReset={() => {
          setSearch("");
          setDivisionFilter(undefined);
          setMajorFilter(undefined);
        }}
      />

      <DataTable
        columns={columns}
        data={divisionAssistants}
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
