import { deleteCommentApi } from "@/api/comments";
import type { Comments } from "@/types/posts";
import { useSession } from "next-auth/react";
import { getTime } from "@/helpers";
import React from "react";
import Image from "next/image";

const PostComment = ({ comment }: { comment: Comments }) => {
  const { author, comment: text, createdAt } = comment;
  const { data: sessionData } = useSession();
  const userId = sessionData ? sessionData?.user?.id : null;
  const { deleteComment, deleteCommentLoading } = deleteCommentApi();

  const deleteCommentOnClick = ({ id }: { id: string }) => {
    return deleteComment({ id });
  };

  return (
    <div className="relative p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Image
            src={author.image || ""}
            width={16}
            height={16}
            className="block h-4 w-4 rounded-full"
            alt={author.name || ""}
          />
          <span className="text-sm font-semibold">{author.name}</span>
          <p className="text-xs text-gray-400">{getTime(createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          {author.id === userId && (
            <button
              aria-label="delete comment"
              onClick={() => deleteCommentOnClick(comment)}
              className="btn-ghost btn-square btn-xs btn"
            >
              {deleteCommentLoading ? (
                <span className="loading loading-dots loading-xs" />
              ) : (
                "x"
              )}
            </button>
          )}
        </div>
      </div>
      <p className="mt-1 rounded-lg bg-base-200 p-1 px-2 text-sm">{text}</p>
    </div>
  );
};

export default PostComment;
