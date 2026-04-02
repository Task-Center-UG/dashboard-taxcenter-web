"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { MbkmRegistrationCellAction } from "./mbkm-registration-cell-action";
import { Badge } from "@/components/ui/badge";

export type MbkmRegistrationColumn = {
  id: number;
  full_name: string;
  class: string;
  npm: string;
  address: string;
  phone_number: string;
  email: string;
  tax_volunteer_activities: string;
  is_already_tax_volunteer: string;
  ipk: number;
  krs: string;
  transcripts: string;
  status: string;
  is_active: string;
  created_at: string;
  updated_at: string;
  region_id: number;
  major_id: number;
  Region: {
    id: number;
    name: string;
  };
  Major: {
    id: number;
    name: string;
  };
};

const statusVariant: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  DITERIMA:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  DITOLAK: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const columns: ColumnDef<MbkmRegistrationColumn>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama Lengkap" />
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.full_name}
      </span>
    ),
  },
  {
    accessorKey: "npm",
    header: "NPM",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground font-mono">
        {row.original.npm}
      </span>
    ),
  },
  {
    accessorKey: "class",
    header: "Kelas",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.class}
      </span>
    ),
  },
  {
    accessorKey: "Major",
    header: "Program Studi",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.Major?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "Region",
    header: "Wilayah",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.Region?.name || "-"}
      </span>
    ),
  },
  {
    accessorKey: "ipk",
    header: "IPK",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.ipk}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`rounded-full text-xs font-semibold px-3 py-1 border-0 ${
            statusVariant[status] || "bg-zinc-100 text-zinc-800"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <MbkmRegistrationCellAction data={row.original} />,
  },
];
