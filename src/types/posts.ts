import type { Post } from "@prisma/client";

export interface FullPost extends Post {
  author: {
    name: string | null;
    image: string | null;
    id: string | null;
  };
  comments: Comments[];
}

export interface Comments {
  id: string;
  comment: string;
  createdAt: Date;
  authorId: string;
  author: {
    name: string | null;
    image: string | null;
    id: string | null;
  };
  post: {
    id: string;
  };
}

export interface PostProps {
  post: FullPost;
  userId: string;
}
