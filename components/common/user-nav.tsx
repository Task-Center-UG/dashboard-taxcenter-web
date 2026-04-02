"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, ChevronDown, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetData } from "@/hooks/use-get-data";
import { usePostData } from "@/hooks/use-post-data";
import { removeUserCookie } from "@/lib/auth-cookie";

interface UserProfile {
  id: number;
  username: string;
  full_name: string;
  email: string;
  picture_url: string;
  role: {
    id: number;
    name: string;
  };
}

export function UserNav() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    isError,
  } = useGetData<UserProfile>({
    key: ["user-profile"],
    url: "/users/profile",
    options: {
      retry: 1,
    },
  });

  const logoutMutation = usePostData({
    url: "/auth/logout",
    successMessage: "Berhasil Keluar",
    options: {
      onSuccess: () => {
        removeUserCookie();
        queryClient.removeQueries({ queryKey: ["user-profile"] });
        router.push("/auth/sign-in");
      },
      onError: () => {
        removeUserCookie();
        router.push("/auth/sign-in");
      },
    },
  });

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleProfileClick = () => {
    if (user?.role?.name === "Tax Volunteer") {
      router.push("/dashboard-tax-volunteers/profile");
    } else {
      router.push("/dashboard/profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-auto p-0 hover:bg-transparent focus-visible:ring-0"
        >
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-bold text-[#2D1B69] dark:text-zinc-100 leading-none">
                {user.full_name}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {user.role?.name || "User"}
              </span>
            </div>

            <Avatar className="h-9 w-9 border-2 border-zinc-100 dark:border-zinc-800 shadow-sm transition-transform hover:scale-105 cursor-pointer">
              <AvatarImage
                src={getImageUrl(user.picture_url)}
                alt={user.full_name}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#2D1B69] text-white text-xs font-bold">
                {getInitials(user.full_name)}
              </AvatarFallback>
            </Avatar>

            <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleProfileClick}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Profil Saya</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
          onClick={() => logoutMutation.mutate({})}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4 text-red-600" />
          )}
          <span>{logoutMutation.isPending ? "Keluar..." : "Keluar"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
