"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getImageUrl } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { AwardCellAction } from "./award-cell-action";

export type AwardColumn = {
  id: number;
  title: string;
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
};

export const columns: ColumnDef<AwardColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    cell: ({ row }) => {
      const award = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
            <img
              src={getImageUrl(award.picture_url)}
              alt={award.title}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium text-foreground">{award.title}</span>
        </div>
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
    cell: ({ row }) => <AwardCellAction data={row.original} />,
  },
];
