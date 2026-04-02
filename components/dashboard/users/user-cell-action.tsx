"use client";

import { useState } from "react";
import { Edit, MoreHorizontal, Trash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteData } from "@/hooks/use-delete-data";
import { useQueryClient } from "@tanstack/react-query";

interface UserCellActionProps {
  data: {
    id: number;
    full_name: string;
  };
}

export function UserCellAction({ data }: UserCellActionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending } = useDeleteData({
    url: "/users",
    invalidateKeys: [["users-list"]],
    successMessage: `User ${data.full_name} berhasil dihapus`,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users-list"],
          type: "active",
        });

        setOpen(false);
      },
    },
  });

  const onConfirm = () => {
    deleteUser(data.id.toString());
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun{" "}
              <span className="font-bold text-foreground">
                {data.full_name}
              </span>{" "}
              secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            //TODO: GANTI KE SINI KALO BACKEND UDAH BISA 'GET DETAIL USER'
            // onClick={() => router.push(`/dashboard/users/${data.id}/update`)}
            onClick={() => router.push(`/coming-soon`)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit User
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
            onSelect={() => setOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4 text-red-600" /> Hapus User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
