import React from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import type { Chat } from "@prisma/client";
import { useSession } from "next-auth/react";
import chatBG from "@/assets/chatbg.png";
import { ChatUsers, ChatMessage } from "@/components/chat";
import { ChatForm } from "@/components/forms";

interface ChatProps {
  slug: string;
}

const Chat: React.FC<ChatProps> = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const { data: chat, isLoading } = api.chat.getChat.useQuery({
    id: slug as string,
  });

  const ownerId = chat?.ownerId || "";
  const chatId = chat?.id || "";
  const userId = sessionData ? sessionData.user.id : "";

  const { users, messages } = chat || {};

  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-hidden pl-16">
      <div className="grid h-screen w-full grid-cols-12">
        {chat && users && (
          <ChatUsers {...{ chat, users, ownerId, chatId, userId }} />
        )}
        <>
          {messages && messages.length > 0 ? (
            <div className="relative col-span-10 h-[93.5vh] w-full overflow-scroll bg-base-300 p-5">
              {messages?.map((message) => (
                <ChatMessage key={message.id} {...message} />
              ))}
            </div>
          ) : (
            <div className="col-span-10 flex h-[94vh] w-full items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <img
                  className="h-48 w-48"
                  src={chatBG.src}
                  alt="No messages yet"
                />
                <p className="text-bold text-2xl">
                  Be the first to say something!
                </p>
              </div>
            </div>
          )}
        </>
        <div className="sticky col-span-10 col-start-3 flex w-full justify-end">
          <ChatForm chatId={slug as string} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
