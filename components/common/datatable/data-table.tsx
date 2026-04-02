"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>;
  sorting: SortingState;
  onSortingChange: React.Dispatch<React.SetStateAction<SortingState>>;
  isLoading?: boolean;
  searchKey?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading,
  searchKey,
  searchValue,
  onSearchValueChange,
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange,
    onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {searchKey && onSearchValueChange && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
            <Input
              placeholder={`Filter by ${searchKey}...`}
              value={searchValue ?? ""}
              onChange={(event) => onSearchValueChange(event.target.value)}
              className="pl-9 h-10 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 rounded-xl focus:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary/20 transition-all"
            />
          </div>
        </div>
      )}

      <Card className="border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm rounded-2xl overflow-hidden transition-all hover:shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-b border-slate-100 dark:border-zinc-800/50"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 bg-slate-50/50 dark:bg-zinc-900/20 pl-6"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: pagination.pageSize }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-b border-slate-50 dark:border-zinc-900"
                  >
                    {columns.map((col, j) => (
                      <TableCell key={j} className="pl-6 py-4">
                        <Skeleton className="h-6 w-full rounded-lg bg-slate-100 dark:bg-zinc-800" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b border-slate-50 dark:border-zinc-900 hover:bg-slate-50/60 dark:hover:bg-zinc-900/40 transition-colors data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="pl-6 py-4 text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <div className="border-t border-slate-100 dark:border-zinc-800 p-2 bg-slate-50/30 dark:bg-zinc-900/10">
          <DataTablePagination table={table} />
        </div>
      </Card>
    </div>
  );
}
