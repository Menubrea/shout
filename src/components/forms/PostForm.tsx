import React from "react";
import { useSession } from "next-auth/react";
import { BiSolidSend } from "react-icons/bi";

import { createPostApi } from "@/api/posts";

export default function PostForm() {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : "";
  const userName = sessionData && sessionData.user ? sessionData.user.name : "";
  const { createPost, createPostLoading } = createPostApi();

  const submitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.namedItem("text") as HTMLInputElement;
    createPost({ text: text.value, authorId: userId });
    text.value = "";
  };

  let placeholder = "Login to post";
  if (sessionData && userName) {
    placeholder = `What's on your mind ${userName}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-2">
      <form onSubmit={submitPost} className="flex w-full items-center gap-2">
        <textarea
          className="textarea-bordered textarea w-full"
          name="text"
          minLength={1}
          maxLength={255}
          required
          disabled={!sessionData}
          rows={1}
          placeholder={placeholder}
        ></textarea>
        <button
          type="submit"
          disabled={!sessionData}
          className={`btn-base btn-circle btn ${
            createPostLoading ? "btn-neutral" : ""
          }`}
        >
          {createPostLoading ? (
            <span className="loading loading-dots loading-md " />
          ) : (
            <BiSolidSend className="h-8 w-6 text-accent" />
          )}
        </button>
      </form>
    </div>
  );
}
