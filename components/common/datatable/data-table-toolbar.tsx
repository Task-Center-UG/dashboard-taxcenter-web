"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

export interface DataTableFilterOption {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DataTableFilterConfig {
  key: string;
  title: string;
  options: DataTableFilterOption[];
}

interface DataTableToolbarProps {
  searchKey?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: DataTableFilterConfig[];
  filterValues?: Record<string, string | string[] | undefined>;
  onFilterChange?: (key: string, value: string | string[] | undefined) => void;
  onReset?: () => void;
}

export function DataTableToolbar({
  searchKey,
  searchValue,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onReset,
}: DataTableToolbarProps) {
  const isFiltered =
    (searchValue && searchValue.length > 0) ||
    Object.values(filterValues).some((v) => {
      if (Array.isArray(v)) return v.length > 0;
      return !!v;
    });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        {searchKey && onSearchChange && (
          <Input
            placeholder={`Filter by ${searchKey}...`}
            value={searchValue ?? ""}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-10 w-full sm:w-[250px] lg:w-[300px] bg-white dark:bg-zinc-950 rounded-xl"
          />
        )}

        {filters.map((filter) => (
          <DataTableFacetedFilter
            key={filter.key}
            title={filter.title}
            options={filter.options}
            value={filterValues[filter.key]}
            onChange={(val: any) => onFilterChange?.(filter.key, val)}
          />
        ))}

        {isFiltered && onReset && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-10 px-2 lg:px-3 text-muted-foreground hover:text-foreground"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
