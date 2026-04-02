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
  DropdownMenuSeparator,
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

interface ArticleCellActionProps {
  data: {
    id: number;
    title: string;
  };
}

export function ArticleCellAction({ data }: ArticleCellActionProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteItem, isPending: isDeleting } = useDeleteData({
    url: "/article",
    invalidateKeys: [["article-list"]],
    successMessage: `"${data.title}" berhasil dihapus`,
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["article-list"],
          type: "active",
        });
        setDeleteOpen(false);
      },
    },
  });

  const onConfirmDelete = () => {
    deleteItem(data.id.toString());
  };

  return (
    <>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data{" "}
              <span className="font-bold text-foreground">{data.title}</span>{" "}
              secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onConfirmDelete();
              }}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
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
            onClick={() =>
              router.push(`/dashboard/activities/articles/${data.id}/update`)
            }
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer"
            onSelect={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4 text-red-600" /> Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
