"use client";

import Cookies from "js-cookie";
import { USER_COOKIE_KEY } from "@/constant/constant";

export type CurrentUserSnapshot = {
  id: number;
  username: string;
  email?: string | null;
  full_name?: string | null;
  role?: { id?: number; name?: string } | null;
};

export function setUserCookie(user: CurrentUserSnapshot) {
  const payload: CurrentUserSnapshot = {
    id: user.id,
    username: user.username,
    email: user.email ?? null,
    full_name: user.full_name ?? null,
    role: user.role ?? null,
  };

  Cookies.set(USER_COOKIE_KEY, JSON.stringify(payload), {
    sameSite: "lax",
    expires: 7,
    path: "/",
  });
}

export function getUserCookie(): CurrentUserSnapshot | null {
  const raw = Cookies.get(USER_COOKIE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CurrentUserSnapshot;
  } catch {
    return null;
  }
}

export function removeUserCookie() {
  Cookies.remove(USER_COOKIE_KEY, { path: "/" });
}

export function isSameUser(a: CurrentUserSnapshot, b: CurrentUserSnapshot) {
  return (
    a.id === b.id &&
    a.username === b.username &&
    (a.role?.name ?? null) === (b.role?.name ?? null)
  );
}
