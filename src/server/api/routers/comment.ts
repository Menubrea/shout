import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const commentSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment must be at least 1 character long")
    .max(255, "Comment must be at most 255 characters long"),
  postId: z.string(),
  authorId: z.string(),
});

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(commentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.create({
        data: {
          comment: input.comment,
          post: {
            connect: {
              id: input.postId,
            },
          },
          author: {
            connect: {
              id: input.authorId,
            },
          },
        },
      });
    }),

  edit: protectedProcedure
    .input(commentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.update({
        data: {
          comment: input.comment,
        },
        where: {
          id: input.postId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
