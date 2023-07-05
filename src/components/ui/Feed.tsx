import React from "react";
import { useSession } from "next-auth/react";

import { api } from "@/utils/api";
import { SinglePost } from "@/components/posts";

const Feed = () => {
  const { data: sessionData } = useSession();
  const userId = sessionData && sessionData.user ? sessionData.user.id : "";
  const { data: posts } = api.posts.getAll.useQuery();

  return (
    <section className="mx-auto min-h-screen w-full max-w-lg">
      {posts?.map((post) => (
        <SinglePost key={post.id} post={post} userId={userId} />
      ))}
    </section>
  );
};

export default Feed;
