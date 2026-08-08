"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, signOut } from "../api/session";

export const AUTH_SESSION_QUERY_KEY = ["auth", "session"] as const;

export function useSession() {
  const query = useQuery({
    queryFn: getSession,
    queryKey: AUTH_SESSION_QUERY_KEY,
  });

  return {
    ...query,
    data: query.data ?? null,
    status: query.isPending
      ? ("loading" as const)
      : query.data
        ? ("authenticated" as const)
        : ("unauthenticated" as const),
    update: query.refetch,
  };
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, null);
    },
  });
}
