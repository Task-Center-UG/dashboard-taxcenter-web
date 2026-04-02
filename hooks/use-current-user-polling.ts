"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import {
  getUserCookie,
  isSameUser,
  removeUserCookie,
  setUserCookie,
  type CurrentUserSnapshot,
} from "@/lib/auth-cookie";

async function fetchCurrentUser(): Promise<CurrentUserSnapshot> {
  const { data } = await axiosInstance.get("/users/profile");
  return data.data;
}

export function useCurrentUserPolling(enabled: boolean = true) {
  const query = useQuery<CurrentUserSnapshot, Error>({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    enabled,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,

    retry: (failureCount) => {
      return failureCount < 10;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * (attemptIndex + 1), 5000),
  });

  useEffect(() => {
    if (!query.data) return;

    const serverUser = query.data;
    const cookieUser = getUserCookie();

    if (!cookieUser) {
      setUserCookie(serverUser);
      return;
    }

    if (!isSameUser(cookieUser, serverUser)) {
      removeUserCookie();
      return;
    }

    setUserCookie(serverUser);
  }, [query.data]);

  useEffect(() => {
    if (query.isError && query.failureCount >= 10) {
      removeUserCookie();
    }
  }, [query.isError, query.failureCount]);

  return query;
}
