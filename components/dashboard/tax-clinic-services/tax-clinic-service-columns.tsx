"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { TaxClinicServiceCellAction } from "./tax-clinic-service-cell-action";

export type TaxClinicServiceColumn = {
  id: number;
  title: string;
  category: string;
  video_url: string;
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

const categoryLabels: Record<string, string> = {
  CORETAX: "Coretax",
  NPWP_CREATION: "Pembuatan NPWP",
  SPT_FILLING: "Pengisian SPT",
  E_BILLING_CREATION: "Pembuatan E-Billing",
};

export const columns: ColumnDef<TaxClinicServiceColumn>[] = [
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
    accessorKey: "category",
    header: "Kategori",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {categoryLabels[row.original.category] || row.original.category}
      </span>
    ),
  },
  {
    accessorKey: "video_url",
    header: "Video URL",
    cell: ({ row }) => {
      const url = row.original.video_url;
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
    cell: ({ row }) => <TaxClinicServiceCellAction data={row.original} />,
  },
];
