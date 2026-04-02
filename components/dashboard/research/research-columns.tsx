"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { ResearchCellAction } from "./research-cell-action";

export type ResearchColumn = {
  id: number;
  title: string;
  description: string;
  cta_url: string;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  updated_by_id: number;
  research_category_id: number;
  ResearchCategory: {
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    created_by_id: number;
    updated_by_id: number;
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

export const columns: ColumnDef<ResearchColumn>[] = [
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
    accessorKey: "ResearchCategory",
    header: "Kategori",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.ResearchCategory?.title || "-"}
      </span>
    ),
  },
  {
    accessorKey: "cta_url",
    header: "CTA URL",
    cell: ({ row }) => {
      const url = row.original.cta_url;
      return url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline truncate max-w-[200px] block"
        >
          {url}
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      );
    },
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
    id: "actions",
    cell: ({ row }) => <ResearchCellAction data={row.original} />,
  },
];
