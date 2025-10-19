// useDeletePost.ts
import { useConfirm } from '@/hooks/modalConfirm/ConfirmModal';
import { useSnackbar } from '@/hooks/snackbar/snackbar';
import { deletePost } from '@/services/post';

export function useDeletePost() {
  const { confirm } = useConfirm();
  const { showSnackbar } = useSnackbar();

  const handleDeletePost = async (id: string) => {
    const ok = await confirm({
      message: 'Deseja realmente deletar este item?',
      TextButton1: 'Cancelar',
      TextButton2: 'Deletar',
    });

    if (ok) {
      try {
        await deletePost(id);
        showSnackbar({ message: 'Item deletado com sucesso!', duration: 3000 });
      } catch {
        showSnackbar({ message: 'Erro ao deletar a postagem!', duration: 3000 });
      }
    } else {
      showSnackbar({ message: 'Ação cancelada', duration: 3000 });
    }
  };
  
  return { handleDeletePost };
}
