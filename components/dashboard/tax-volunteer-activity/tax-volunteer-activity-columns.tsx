"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { TaxVolunteerActivityCellAction } from "./tax-volunteer-activity-cell-action";
import { getImageUrl } from "@/lib/utils";

export type TaxVolunteerActivityColumn = {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
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
  SPT_ASSISTANT: "Asistensi SPT",
  PUBLIC_RELATIONS_FUNCTION: "Fungsi Humas",
  SUPPORTING_ACTIVITIES: "Kegiatan Pendukung",
  BUSINESS_DEVELOPMENT_SERVICES: "Layanan Pengembangan Usaha",
};

export const columns: ColumnDef<TaxVolunteerActivityColumn>[] = [
  {
    accessorKey: "image_url",
    header: "Gambar",
    cell: ({ row }) => {
      const imageUrl = row.original.image_url;
      return imageUrl ? (
        <img
          src={getImageUrl(imageUrl)}
          alt={row.original.title}
          className="h-16 w-24 rounded-lg object-cover border border-zinc-200 dark:border-zinc-700"
        />
      ) : (
        <div className="h-16 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-muted-foreground">
          No Image
        </div>
      );
    },
  },
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategori" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {categoryLabels[row.original.category] || row.original.category}
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
    cell: ({ row }) => <TaxVolunteerActivityCellAction data={row.original} />,
  },
];
