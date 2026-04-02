"use client";

import { useState, useEffect } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/datatable/data-table";
import { DataTableToolbar } from "@/components/common/datatable/data-table-toolbar";
import { columns } from "./user-columns";

export default function UserDataTable() {
  const router = useRouter();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string[] | undefined>(undefined);

  const debouncedSearch = useDebounce(search, 500);

  const { data: rolesMaster } = useGetData<any[]>({
    key: ["master-roles"],
    url: "/master/role",
  });

  const roleOptions =
    rolesMaster?.map((r) => ({
      label: r.name,
      value: String(r.id),
    })) || [];

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, roleFilter]);

  const sortField = sorting[0]?.id || "created_at";
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetData<any>({
    key: [
      "users-list",
      String(pagination.pageIndex),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
      String(roleFilter),
    ],
    url: "/users",
    params: {
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField,
      order: sortOrder,
      search: debouncedSearch || undefined,
      role: roleFilter?.join(",") || undefined,
    },
  });

  const users = data?.users || [];
  const pageCount = data?.paging?.total_pages || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2D1B69] dark:text-zinc-100">
            Manajemen User
          </h2>
          <p className="text-muted-foreground">
            Kelola data akun admin, asisten, dan relawan pajak dalam sistem.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/users/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tambah User
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Username/Nama"
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            key: "role",
            title: "Role",
            options: roleOptions,
          },
        ]}
        filterValues={{ role: roleFilter }}
        onFilterChange={(_, val) => setRoleFilter(val as string[])}
        onReset={() => {
          setSearch("");
          setRoleFilter(undefined);
        }}
      />

      <DataTable
        columns={columns}
        data={users}
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
