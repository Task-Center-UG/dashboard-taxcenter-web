"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getImageUrl } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { SliderCellAction } from "./slider-cell-action";

export type SliderColumn = {
  id: number;
  title: string;
  picture_url: string;
  cta_url: string;
  description: string;
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

export const columns: ColumnDef<SliderColumn>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Judul" />
    ),
    cell: ({ row }) => {
      const slider = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-12 w-20 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
            <img
              src={getImageUrl(slider.picture_url)}
              alt={slider.title}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium text-foreground">{slider.title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "cta_url",
    header: "CTA URL",
    cell: ({ row }) => {
      const url = row.original.cta_url;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[200px] block"
          title={url}
        >
          {url}
        </a>
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
    cell: ({ row }) => <SliderCellAction data={row.original} />,
  },
];
