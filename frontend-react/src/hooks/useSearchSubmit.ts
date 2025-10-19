import { useSnackbar } from "../store/snackbar/useSnackbar";
import type { PostSearch } from "../types/post";


// Essa função recebe `fetchPosts` e os dados do filtro como argumento
export function useSearchSubmit(fetchPosts: (props: PostSearch) => Promise<void>) {
  const { showSnackbar } = useSnackbar();

  const handleFetchAdvanced = async (filters: {
    postSearch: string | null;
    postAuthor: string | null;
    postContent: string | null;
    createdAtBefore: Date | null;
    createdAtAfter: Date | null;
    offset: string;
    limit: string;
    onClose: () => void;
  }) => {
    const controller = new AbortController();

    try {
      await fetchPosts({
        advanced: true,
        search: filters.postSearch,
        userId: filters.postAuthor,
        createdAtBefore: filters.createdAtBefore,
        createdAtAfter: filters.createdAtAfter,
        content: filters.postContent,
        offset: filters.offset,
        limit: filters.limit,
        signal: controller.signal,
      });

      showSnackbar({ message: "Filtros aplicados com sucesso!", severity: "success" });
      filters.onClose(); // fecha o modal
    } catch (err: any) {
      if (err.name === "CanceledError") return; // abortado de propósito
      showSnackbar({ message: "Erro ao aplicar filtros. Tente novamente.", severity: "error" });
      console.error("error while applying advanced filters: ", err);
    }
  };

  return { handleFetchAdvanced };
}

