import React from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { BsFillPlusCircleFill } from "react-icons/bs";

const CreateChat = () => {
  const [nameInput, setNameInput] = React.useState("");
  const [imageInput, setImageInput] = React.useState("");
  const { data: sessionData } = useSession();
  const ctx = api.useContext();
  const userId = sessionData ? sessionData.user.id : "";
  const { mutate: createChat } = api.chat.create.useMutation({
    onSuccess: async () => {
      return await ctx.users.getById.invalidate({ id: userId });
    },
  });

  const submitChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget.elements.namedItem("name") as HTMLInputElement;
    const image = e.currentTarget.elements.namedItem(
      "image"
    ) as HTMLInputElement;
    const users: string[] = [];

    createChat({
      name: name.value,
      image: image.value,
      ownerId: userId,
      users: [userId, ...users],
      id: userId,
    });
  };

  return (
    <div className="flex min-h-screen flex-row items-center justify-center">
      <form
        onSubmit={submitChat}
        className="flex flex-col items-center justify-center border border-neutral bg-base-200"
      >
        <input
          className="input rounded-none"
          type="text"
          onChange={(e) => setNameInput(e.target.value)}
          name="name"
          required
          placeholder="Chat name"
        />

        <input
          className="input rounded-none"
          type="text"
          name="image"
          onChange={(e) => setImageInput(e.target.value)}
          required
          placeholder="Chat image"
        />

        <button className="btn-ghost btn-circle btn-lg shadow-md">
          <BsFillPlusCircleFill className="h-8 w-8" />
        </button>
      </form>
      <div>
        {/* Preview */}
        <p>{nameInput || "Preview your Chat Server Name"}</p>
      </div>
    </div>
  );
};

export default CreateChat;
