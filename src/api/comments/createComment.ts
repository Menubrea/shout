import { api } from "@/utils/api";

export default function createCommentApi() {
  const ctx = api.useContext();

  const { mutate: createComment, isLoading: commentLoading } =
    api.comment.create.useMutation({
      onSuccess: async () => {
        return await ctx.posts.getAll.invalidate();
      },
    });

  return { createComment, commentLoading };
}
