import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dragonApi } from "../api/dragon-api";
import { DragonFormData } from "../types/dragon-types";

export const DRAGONS_QUERY_KEY = ["dragons"];
export const DRAGON_DETAIL_KEY = (id: string) => ["dragon", id];

export function useDragonsQuery() {
  return useQuery({
    queryKey: DRAGONS_QUERY_KEY,
    queryFn: () => dragonApi.getDragons(),
  });
}

export function useDragonDetailQuery(id: string) {
  return useQuery({
    queryKey: DRAGON_DETAIL_KEY(id),
    queryFn: () => dragonApi.getDragonById(id),
    enabled: !!id,
  });
}

export function useCreateDragonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DragonFormData) => dragonApi.createDragon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRAGONS_QUERY_KEY });
    },
  });
}

export function useUpdateDragonMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DragonFormData) => dragonApi.updateDragon(id, data),
    onSuccess: (updatedDragon) => {
      queryClient.invalidateQueries({ queryKey: DRAGONS_QUERY_KEY });
      queryClient.setQueryData(DRAGON_DETAIL_KEY(id), updatedDragon);
    },
  });
}

export function useDeleteDragonMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dragonApi.deleteDragon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRAGONS_QUERY_KEY });
    },
  });
}
