import type { Chat, User } from "@prisma/client";
import { GetUsers } from "@/components/chat";
import Image from "next/image";

interface UserContainerProps {
  chat: Chat;
  users: User[];
  ownerId: string;
  chatId: string;
  userId: string;
}

const UserContainer = ({ ...props }: UserContainerProps) => {
  const { chat, users, ownerId, chatId, userId } = props;

  return (
    <div className="col-span-2 h-full max-h-screen w-full">
      <div
        className={`text-bold relative flex items-center justify-center gap-2 border-x border-neutral bg-base-100 text-sm`}
      >
        <img
          className="h-full max-h-12 w-full object-cover"
          alt={`${chat?.name} Avatar`}
          src={chat?.image || ""}
        />
        <h1 className="absolute w-full bg-base-300 bg-opacity-30 text-center backdrop-blur-md">
          {chat?.name || "Chat"}
        </h1>
      </div>
      <div className="flex h-full flex-col items-center border border-neutral">
        {users?.map((user) => (
          <div
            key={user.id}
            className="flex w-full items-center gap-2 border-b border-neutral py-2 ps-2"
          >
            <Image
              width={16}
              height={16}
              className="h-4 w-4 rounded-full"
              src={user?.image || ""}
              alt={user?.name || ""}
            />
            <span className="text-sm text-accent">{user?.name || "Anon"}</span>
          </div>
        ))}
        {users && ownerId === userId && (
          <div className="collapse rounded-none border-b border-neutral">
            <input type="checkbox" />
            <div className="collapse-title rounded-none font-medium">
              Add Users
            </div>
            <div className="collapse-content rounded-none p-0">
              <GetUsers users={users} ownerId={ownerId} chatId={chatId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserContainer;
