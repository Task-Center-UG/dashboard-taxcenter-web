import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { axiosInstance } from "@/lib/axios";

interface UseDeleteDataProps<T, TContext> {
  url: string;
  invalidateKeys?: string[][];
  successMessage?: string;
  options?: UseMutationOptions<T, Error, string, TContext>;
}

export const useDeleteData = <T, TContext = unknown>({
  url,
  invalidateKeys = [],
  successMessage = "Data deleted successfully",
  options,
}: UseDeleteDataProps<T, TContext>) => {
  const queryClient = useQueryClient();

  return useMutation<T, Error, string, TContext>({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`${url}/${id}`);
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
        "Failed to delete data";

      toast.error(errorMessage);

      if (options?.onError) {
        options.onError(...args);
      }
    },
    ...options,
  });
};
