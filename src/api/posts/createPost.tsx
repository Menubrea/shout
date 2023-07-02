import { api } from "@/utils/api";

export default function createPostApi() {
  const ctx = api.useContext();

  const {
    mutate: createPost,
    isLoading: createPostLoading,
    isError: createPostError,
  } = api.posts.create.useMutation({
    onSuccess: async () => {
      return await ctx.posts.getAll.invalidate();
    },
  });

  return { createPost, createPostLoading, createPostError };
}
