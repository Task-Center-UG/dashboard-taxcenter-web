"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { TaxModuleCellAction } from "./tax-module-cell-action";
import { FileText } from "lucide-react";

export type TaxModuleColumn = {
  id: number;
  title: string;
  description: string;
  category: string;
  file_url: string;
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

export const columns: ColumnDef<TaxModuleColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul Modul" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#2D1B69]/10 dark:bg-[#2D1B69]/20 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-[#2D1B69] dark:text-white" />
          </div>
          <span className="font-medium text-foreground">
            {row.original.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.category || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
          {row.original.description || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "created_by",
    header: "Dibuat oleh",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.created_by?.full_name || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "updated_by",
    header: "Diperbarui oleh",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.updated_by?.full_name || "-"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TaxModuleCellAction data={row.original} />,
  },
];
