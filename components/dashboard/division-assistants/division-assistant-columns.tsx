"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getImageUrl } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { DivisionAssistantCellAction } from "./division-assistant-cell-action";

export type DivisionAssistantColumn = {
  id: number;
  name: string;
  picture_url: string;
  created_at: string;
  updated_at: string;
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
  Division: {
    id: number;
    name: string;
  };
  Major: {
    id: number;
    name: string;
  };
};

export const columns: ColumnDef<DivisionAssistantColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
            <img
              src={getImageUrl(item.picture_url)}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium text-foreground">{item.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "Division",
    header: "Divisi",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.Division?.name || "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "Major",
    header: "Program Studi",
    cell: ({ row }) => {
      return (
        <span className="text-sm text-muted-foreground">
          {row.original.Major?.name || "-"}
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
    cell: ({ row }) => <DivisionAssistantCellAction data={row.original} />,
  },
];
