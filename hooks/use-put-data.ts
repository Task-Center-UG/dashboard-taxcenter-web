import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface PutVariables<D> {
  slug?: string | number;
  data: D;
}

interface UsePutDataProps<T, D, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  options?: UseMutationOptions<T, Error, PutVariables<D>, TContext>;
}

export const usePutData = <T, D, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data saved successfully",
  options,
}: UsePutDataProps<T, D, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, PutVariables<D>, TContext>({
    mutationFn: async ({ slug, data: payload }) => {
      const finalUrl = slug ? `${url}/${slug}` : url;

      const isFormData = payload instanceof FormData;

      const { data } = await axiosInstance.put(finalUrl, payload, {
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
        },
      });
      return data.data;
    },
    onSuccess: (...args) => {
      if (invalidateKeys.length > 0) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      toast.success(successMessage);

      if (options?.onSuccess) {
        options.onSuccess(...args);
      }
    },
    onError: (...args) => {
      const error = args[0] as AxiosError<any>;
      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Failed to save data";

      toast.error(errorMessage);

      if (options?.onError) {
        options.onError(...args);
      }
    },
    ...options,
  });
};
