import type { User } from "@prisma/client";
import { api } from "@/utils/api";

interface GetUsersProps {
  ownerId: string;
  chatId: string;
  users: User[];
}

const GetUsers = ({ ...props }: GetUsersProps) => {
  const { chatId, ownerId, users: chatUsers } = props;
  const { data: users } = api.users.getAll.useQuery();
  const ctx = api.useContext();

  const { mutate: addUser, isLoading } = api.chat.addUser.useMutation({
    onSuccess: async () => {
      await ctx.chat.getChat.invalidate({ id: chatId });
    },
  });

  const filteredUsers = users?.filter(
    (user) => !chatUsers.map((u) => u.id).includes(user.id)
  );

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const userId = e.currentTarget.id;
    addUser({ userId, chatId, ownerId });
  };

  return (
    <div className="overflow-scroll rounded-lg">
      <div>
        {filteredUsers?.map((user) => (
          <div key={user.id} className="flex w-full gap-2 px-5 py-2">
            <p>{user.name}</p>
            <button
              onClick={onClick}
              id={user.id}
              className="btn-base btn-xs btn rounded-none border border-neutral"
            >
              {isLoading ? (
                <span className="loading loading-dots h-6 w-6" />
              ) : (
                "Add"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetUsers;
