import React from "react";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import Image from "next/image";
import { StaticImageData } from "next/image";
import chatBg from "@/assets/create-chat-bg.webp";

const CreateChat = () => {
  const [nameInput, setNameInput] = React.useState("");
  const [imageInput, setImageInput] = React.useState("");
  const { data: sessionData } = useSession();
  const ctx = api.useContext();
  const userId = sessionData ? sessionData.user.id : "";
  const { mutate: createChat, isLoading } = api.chat.create.useMutation({
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
    <div className="flex min-h-screen flex-col items-center justify-center pl-16">
      <div className="flex flex-col-reverse gap-2">
        <form
          onSubmit={submitChat}
          className="flex flex-col rounded border border-neutral bg-base-200 p-5"
        >
          <label className="label">
            <span className="label-text">Chat name</span>
            <span className="label-text-alt">{nameInput.length} / 20</span>
          </label>
          <input
            className="input rounded-none"
            type="text"
            onChange={(e) => setNameInput(e.target.value)}
            minLength={1}
            maxLength={20}
            name="name"
            required
            placeholder="Chat name"
          />

          <label className="label">
            <span>
              <span className="label-text">Chat image</span>
            </span>
          </label>
          <input
            className="input rounded-none"
            type="text"
            name="image"
            onChange={(e) => setImageInput(e.target.value)}
            required
            placeholder="Chat image"
          />

          <button className="btn-neutral btn mt-2">
            {isLoading ? (
              <div className="loading loading-dots loading-sm" />
            ) : (
              <>
                {" "}
                Create
                <BsFillPlusCircleFill className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        <div className="relative overflow-hidden rounded border border-neutral">
          {/* Preview */}
          <p className="absolute top-10 w-full bg-accent bg-opacity-80 py-2 pe-5 text-end font-bold text-base-300">
            {nameInput || "Chat Server Name"}
          </p>
          <Image
            width={300}
            height={150}
            src={imageInput || chatBg}
            alt="Preview your Chat Server"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
