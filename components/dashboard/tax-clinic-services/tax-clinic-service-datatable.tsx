"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { useGetData } from "@/hooks/use-get-data";
import { useDebounce } from "@/hooks/use-debounce";
import { DataTable } from "@/components/common/datatable/data-table";
import { DataTableToolbar, DataTableFilterConfig } from "@/components/common/datatable/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { columns, TaxClinicServiceColumn } from "./tax-clinic-service-columns";

interface TaxClinicServiceResponse {
  taxClinicServices: TaxClinicServiceColumn[];
  paging: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}

interface CategoriesResponse {
  taxClinicCategories: string[];
}

const categoryLabels: Record<string, string> = {
  CORETAX: "Coretax",
  NPWP_CREATION: "Pembuatan NPWP",
  SPT_FILLING: "Pengisian SPT",
  E_BILLING_CREATION: "Pembuatan E-Billing",
};

export default function TaxClinicServiceDataTable() {
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

  const { data: categoriesData } = useGetData<CategoriesResponse>({
    key: ["tax-clinic-service-categories"],
    url: "/tax-clinic-service/categories",
  });

  const categoryFilterOptions = (categoriesData?.taxClinicCategories || []).map(
    (cat) => ({
      label: categoryLabels[cat] || cat,
      value: cat,
    })
  );

  const filters: DataTableFilterConfig[] = categoryFilterOptions.length > 0
    ? [
        {
          key: "category",
          title: "Kategori",
          options: categoryFilterOptions,
        },
      ]
    : [];

  const selectedCategory = filterValues.category;
  const categoryParam = Array.isArray(selectedCategory)
    ? selectedCategory[0]
    : selectedCategory;

  const { data, isLoading } = useGetData<TaxClinicServiceResponse>({
    key: [
      "tax-clinic-service-list",
      String(pagination.pageIndex + 1),
      String(pagination.pageSize),
      sortField,
      sortOrder,
      debouncedSearch,
      categoryParam || "",
    ],
    url: "/tax-clinic-service",
    params: {
      title: debouncedSearch || undefined,
      category: categoryParam || undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
      sort_by: sortField || undefined,
      order: sortField ? sortOrder : undefined,
    },
  });

  const items = data?.taxClinicServices || [];
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
            Layanan Tax Clinic
          </h2>
          <p className="text-muted-foreground">
            Kelola data layanan tax clinic.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/tax-clinic/services/create")}
          className="bg-[#2D1B69] hover:bg-[#1e1247] text-white rounded-xl shadow-lg shadow-[#2D1B69]/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tambah Layanan
        </Button>
      </div>

      <DataTableToolbar
        searchKey="Judul"
        searchValue={search}
        onSearchChange={setSearch}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      <DataTable
        columns={columns}
        data={items}
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
