import { api } from "@/utils/api";

export default function deleteCommentApi() {
  const ctx = api.useContext();
  const {
    mutate: deleteComment,
    isLoading: deleteCommentLoading,
    isError: deleteCommentError,
  } = api.comment.delete.useMutation({
    onSuccess: async () => {
      return await ctx.posts.getAll.invalidate();
    },
  });

  return { deleteComment, deleteCommentLoading, deleteCommentError };
}
