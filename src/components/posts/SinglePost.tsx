import type { PostProps } from "@/types/posts";
import type { Post } from "@prisma/client";
import { PostComment } from "@/components/posts";
import { BiSolidSend } from "react-icons/bi";
import { deletePostApi } from "@/api/posts";
import { createCommentApi } from "@/api/comments";
import { getTime } from "@/helpers";
import React from "react";
import Image from "next/image";

const SinglePost = ({ ...props }: PostProps) => {
  const [open, setOpen] = React.useState(false);
  const { post, userId } = props;
  const { text, author, comments, authorId, createdAt } = post;
  const { name, image } = author;

  let placeholder = "Log in to comment";
  if (userId && name) placeholder = `Comment on ${name}'s post`;

  const { deletePost, deletePostLoading } = deletePostApi();
  const { createComment, commentLoading } = createCommentApi();

  const deleteOnClick = ({ id }: Post) => {
    return deletePost({ id: id });
  };

  const submitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const comment = e.currentTarget.elements.namedItem(
      "comment"
    ) as HTMLInputElement;
    createComment({
      comment: comment.value,
      authorId: userId,
      postId: post.id,
    });
    comment.value = "";
  };

  return (
    <article className="relative mt-2 overflow-hidden rounded-none bg-base-100 shadow-md backdrop-blur-md">
      <dialog
        open={open}
        className="absolute z-30 h-full w-full overflow-hidden rounded-md bg-base-100 p-0 shadow-lg"
      >
        {open && (
          <>
            <p className="bg-base-200 px-5 py-3 text-center text-sm">
              You are about to delete this post. This action cannot be undone.
            </p>
            <div className="flex w-full items-center justify-center gap-2 p-2">
              <button
                onClick={() => setOpen(!open)}
                className="btn-ghost btn-sm btn"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteOnClick(post)}
                className={`btn-base btn-sm btn ${
                  deletePostLoading ? "btn-neutral" : ""
                }`}
              >
                {deletePostLoading ? (
                  <span className="loading loading-dots loading-xs" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </>
        )}
      </dialog>
      <div className="flex items-center justify-between bg-base-200 p-2">
        <div className="flex items-center gap-2">
          <Image
            src={image || ""}
            width={32}
            height={32}
            className="block h-8 w-8 rounded-full"
            alt={name || ""}
          />
          <span className=" text-base font-semibold text-accent">{name}</span>
          <div className="h-1 w-1 rounded-full bg-slate-500" />
          <span className="text-xs text-gray-500">{getTime(createdAt)}</span>
        </div>
        {authorId === userId && (
          <button
            onClick={() => setOpen(!open)}
            className={`btn-base btn-sm btn-square btn ${
              deletePostLoading ? "btn-neutral" : ""
            }`}
          >
            {deletePostLoading ? (
              <span className="loading loading-dots loading-xs" />
            ) : (
              "x"
            )}
          </button>
        )}
      </div>
      <p className="m-2 border-l-4 border-accent p-2 text-base">{text}</p>
      {userId !== authorId && (
        <form
          onSubmit={submitComment}
          className="flex w-full items-center gap-2 p-2"
        >
          <input
            className="input-bordered input input-sm w-full"
            name="comment"
            minLength={1}
            maxLength={255}
            required
            disabled={userId === authorId || !userId}
            placeholder={placeholder}
          ></input>
          <button
            disabled={userId === authorId || !userId}
            type="submit"
            className={`btn-ghost btn-sm btn ${"btn-neutral"}`}
          >
            {commentLoading ? (
              <span className="loading loading-dots h-6 w-6" />
            ) : (
              <BiSolidSend className="h-8 w-6 text-accent" />
            )}
          </button>
        </form>
      )}
      {comments?.map((comment) => (
        <PostComment key={comment.id} comment={comment} />
      ))}
    </article>
  );
};

export default SinglePost;
