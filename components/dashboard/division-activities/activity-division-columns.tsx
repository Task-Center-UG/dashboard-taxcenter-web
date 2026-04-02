"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getImageUrl } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { ActivityDivisionCellAction } from "./activity-division-cell-action";

export type ActivityDivisionColumn = {
  id: number;
  title: string;
  description: string;
  picture_url: string;
  division_id: number;
  created_at: string;
  updated_at: string;
  Division: {
    id: number;
    name: string;
  };
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

export const columns: ColumnDef<ActivityDivisionColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul Kegiatan" />
    ),
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
            <img
              src={getImageUrl(item.picture_url)}
              alt={item.title}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium text-foreground">{item.title}</span>
        </div>
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
    cell: ({ row }) => <ActivityDivisionCellAction data={row.original} />,
  },
];
