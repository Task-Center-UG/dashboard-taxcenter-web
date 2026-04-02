"use client";

import { ColumnDef } from "@tanstack/react-table";
import { getImageUrl } from "@/lib/utils";
import { AgendaSliderCellAction } from "./agenda-slider-cell-action";

export type AgendaSliderColumn = {
  id: number;
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

export const columns: ColumnDef<AgendaSliderColumn>[] = [
  {
    accessorKey: "image_url",
    header: "Gambar",
    cell: ({ row }) => {
      const slider = row.original;
      return (
        <div className="h-16 w-28 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
          <img
            src={getImageUrl(slider.image_url)}
            alt={`Slider ${slider.id}`}
            className="h-full w-full object-cover"
          />
        </div>
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
    cell: ({ row }) => <AgendaSliderCellAction data={row.original} />,
  },
];
