import { createTRPCRouter } from "@/server/api/trpc";
import { postsRouter } from "./routers/posts";
import { commentRouter } from "./routers/comment";
import { userRouter } from "./routers/users";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posts: postsRouter,
  comment: commentRouter,
  users: userRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
