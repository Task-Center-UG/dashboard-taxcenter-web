"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getImageUrl } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/common/datatable/data-table-column-header";
import { UserCellAction } from "./user-cell-action";

export type UserColumn = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  picture_url: string | null;
  role: {
    id: number;
    name: string;
  };
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pengguna" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage
              src={getImageUrl(user.picture_url)}
              alt={user.full_name}
              className="object-cover"
            />
            <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">
              {user.full_name}
            </span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const roleName = row.original.role.name;
      const variants: Record<string, string> = {
        Admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        Assistant:
          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "Tax Volunteer":
          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      };
      return (
        <Badge className={`${variants[roleName] || ""} border-0 shadow-none`}>
          {roleName}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />,
  },
];
