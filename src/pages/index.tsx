import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "@/utils/api";
import { IoMdMegaphone } from "react-icons/io";
import React from "react";

export default function Home() {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : "";
  const ctx = api.useContext();

  const { data: posts } = api.posts.getAll.useQuery();
  const { mutate: createPost } = api.posts.create.useMutation({
    onSuccess: async () => {
      return await ctx.posts.getAll.invalidate();
    },
  });
  const { mutate: deletePost } = api.posts.delete.useMutation({
    onSuccess: async () => {
      return await ctx.posts.getAll.invalidate();
    },
  });

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.namedItem("text") as HTMLInputElement;
    createPost({ text: text.value, authorId: userId });
    text.value = "";
  };

  const deleteOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonElement = e.target as HTMLButtonElement;
    return deletePost({ id: buttonElement.id });
  };

  return (
    <>
      <Head>
        <title>Shout</title>
        <meta
          name="description"
          content="Shout, the better Twitter experience"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="grid max-w-5xl grid-cols-12">
          <div className=" relative top-2 col-span-3 min-h-screen w-full p-2">
            <div className="sticky top-2 rounded border border-accent p-2 ">
              <AuthShowcase />
            </div>
          </div>
          <div className="border-base col-span-6 border-x">
            {sessionData && (
              <div className="border-base flex w-full items-center gap-2 border-b p-2">
                <img
                  src={sessionData?.user?.image || ""}
                  alt="avatar"
                  className="block h-12 w-12"
                />

                <form
                  onSubmit={submitForm}
                  className="flex w-full items-center gap-2"
                >
                  <textarea
                    className="textarea-accent textarea w-full"
                    name="text"
                    rows={1}
                    placeholder="Shout something!"
                  ></textarea>
                  <button className="btn-accent btn">
                    <IoMdMegaphone className="h-8 w-8" />
                  </button>
                </form>
              </div>
            )}
            {posts?.map((post) => (
              <div key={post.id} className="border-base border-b">
                <div className="border-base flex items-center justify-between border-b p-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.image || ""}
                      className="block h-8 w-8 rounded-full"
                      alt="avatar"
                    />
                    <span className=" text-base font-semibold text-accent">
                      {post.author.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {post.authorId === userId && (
                    <button
                      id={post.id}
                      onClick={deleteOnClick}
                      className="btn-accent btn-square btn-sm btn"
                    >
                      x
                    </button>
                  )}
                </div>
                <p className="p-2 text-base">{post.text}</p>
              </div>
            ))}
          </div>
          <div className="col-span-3 min-h-screen"></div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-accent px-10 py-3 font-semibold text-white no-underline transition"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
