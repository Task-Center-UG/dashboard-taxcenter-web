"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { TaxVolunteerDocCellAction } from "./tax-volunteer-doc-cell-action";
import { getImageUrl } from "@/lib/utils";
import { FileText } from "lucide-react";

export type TaxVolunteerDocFile = {
  id: number;
  file_url: string;
  created_at: string;
  updated_at: string;
  tax_volunteer_documentation_id: number;
};

export type TaxVolunteerDocColumn = {
  id: number;
  title: string;
  date: string;
  location: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  User: {
    id: number;
    username: string;
    full_name: string;
  };
  create_tax_volunteer_documentation_file: TaxVolunteerDocFile[];
};

export const columns: ColumnDef<TaxVolunteerDocColumn>[] = [
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
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tanggal" />
    ),
    cell: ({ row }) => {
      const date = row.original.date;
      return (
        <span className="text-sm text-muted-foreground">
          {date ? new Date(date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" }) : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lokasi" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.location || "-"}
      </span>
    ),
  },
  {
    accessorKey: "User",
    header: "Pengguna",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.User?.full_name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "create_tax_volunteer_documentation_file",
    header: "File",
    cell: ({ row }) => {
      const files = row.original.create_tax_volunteer_documentation_file || [];
      if (files.length === 0) {
        return <span className="text-sm text-muted-foreground">-</span>;
      }
      return (
        <div className="flex items-center gap-2">
          {files.slice(0, 2).map((file) => (
            <img
              key={file.id}
              src={getImageUrl(file.file_url)}
              alt="File"
              className="h-10 w-10 rounded-md object-cover border border-zinc-200 dark:border-zinc-700"
            />
          ))}
          {files.length > 2 && (
            <div className="h-10 w-10 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs text-muted-foreground">
              +{files.length - 2}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TaxVolunteerDocCellAction data={row.original} />,
  },
];
