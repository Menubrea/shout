import type { User, Message } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { getTime } from "@/helpers";

interface MessageProps extends Message {
  user: User;
}

const ChatMessage = ({ ...props }: MessageProps) => {
  const { user, text, createdAt, authorId } = props;
  const { data: sessionData } = useSession();
  const userId = sessionData ? sessionData.user.id : "";
  const yourMessage = userId === authorId;

  return (
    <div className={`chat ${yourMessage ? "chat-start" : "chat-end"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Image
            width={16}
            height={16}
            src={user?.image || ""}
            alt={user?.name || ""}
          />
        </div>
      </div>
      <div className="chat-header flex items-center gap-2">
        <span className="text-accent">{user?.name || "Anon"}</span>
        <div className="h-1 w-1 rounded-full bg-gray-700" />
        <time className="text-xs opacity-50">{getTime(createdAt || "")}</time>
      </div>
      <div className="chat-bubble">{text || "Message not provided"}</div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
};

export default ChatMessage;
