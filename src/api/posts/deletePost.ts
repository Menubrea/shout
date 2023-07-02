import { api } from "@/utils/api";

export default function deletePostApi() {
  const ctx = api.useContext();

  const {
    mutate: deletePost,
    isLoading: deletePostLoading,
    isError: deletePostError,
  } = api.posts.delete.useMutation({
    onSuccess: async () => {
      return await ctx.posts.getAll.invalidate();
    },
  });

  return { deletePost, deletePostLoading, deletePostError };
}
