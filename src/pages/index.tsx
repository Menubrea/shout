import Head from "next/head";
import React from "react";
import { Feed } from "@/components/ui";
import { PostForm } from "@/components/forms";

export default function Home() {
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
      <main className={`flex min-h-screen flex-col items-center`}>
        <div className="fixed bottom-0 z-10 w-full max-w-2xl translate-x-0 rounded-t-md border-x border-t border-accent bg-base-100 p-2 md:translate-x-8">
          <PostForm />
        </div>
        <div className="gap-2 pb-20 pl-16">
          <Feed />
        </div>
      </main>
    </>
  );
}
