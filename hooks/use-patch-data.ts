import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface PatchVariables<D> {
  slug?: string | number;
  data: D;
}

interface UsePatchDataProps<T, D, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  options?: UseMutationOptions<T, Error, PatchVariables<D>, TContext>;
}

export const usePatchData = <T, D, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data updated successfully",
  options,
}: UsePatchDataProps<T, D, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, PatchVariables<D>, TContext>({
    mutationFn: async ({ slug, data: payload }) => {
      const finalUrl = slug ? `${url}/${slug}` : url;

      const isFormData = payload instanceof FormData;

      const { data } = await axiosInstance.patch(finalUrl, payload, {
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
        "Failed to update data";

      toast.error(errorMessage);

      if (options?.onError) {
        options.onError(...args);
      }
    },
    ...options,
  });
};
