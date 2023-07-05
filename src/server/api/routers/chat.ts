import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

const messageSchema = z.object({
  userId: z.string(),
  text: z.string(),
  chatId: z.string(),
});

const chatSchema = z.object({
  id: z.string(),
  users: z.array(z.string()),
  name: z.string(),
  image: z.string(),
  ownerId: z.string(),
});

export const chatRouter = createTRPCRouter({
  create: protectedProcedure
    .input(chatSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.chat.create({
        data: {
          name: input.name,
          image: input.image,
          owner: {
            connect: {
              id: input.ownerId,
            },
          },
          users: {
            connect: {
              id: input.id,
            },
          },
        },
        include: {
          messages: true,
          users: true,
        },
      });
    }),

  getChat: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.chat.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              user: true,
            },
          },
          users: true,
        },
      });
    }),

  addUser: protectedProcedure
    .input(
      z.object({ chatId: z.string(), userId: z.string(), ownerId: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const { chatId, userId, ownerId } = input;

      const owner = await ctx.prisma.chat.findUnique({
        select: {
          ownerId: true,
        },
        where: {
          id: chatId,
        },
      });

      if (!owner || owner.ownerId !== ownerId) {
        throw new Error("Chat not found, or you are not the owner");
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return await ctx.prisma.chat.update({
        where: {
          id: chatId,
        },
        data: {
          users: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  createMessage: protectedProcedure
    .input(messageSchema)
    .mutation(async ({ ctx, input }) => {
      const { chatId, userId, text } = input;

      const chat = await ctx.prisma.chat.findUnique({
        where: {
          id: chatId,
        },
      });

      if (!chat) {
        throw new Error("Chat not found");
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return await ctx.prisma.message.create({
        data: {
          text,

          chat: {
            connect: {
              id: chatId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),
});
