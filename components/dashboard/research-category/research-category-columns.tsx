"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { ResearchCategoryCellAction } from "./research-category-cell-action";

export type ResearchCategoryColumn = {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  updated_by_id: number;
  created_by: {
    id: number;
    username: string;
    full_name: string;
  };
  updated_by: {
    id: number;
    username: string;
    full_name: string;
  };
};

export const columns: ColumnDef<ResearchCategoryColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground line-clamp-2">
        {row.original.title}
      </span>
    ),
  },
  {
    accessorKey: "created_by",
    header: "Dibuat oleh",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.created_by?.full_name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "updated_by",
    header: "Diperbarui oleh",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.updated_by?.full_name || "-"}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ResearchCategoryCellAction data={row.original} />,
  },
];
