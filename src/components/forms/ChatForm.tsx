import { useSession } from "next-auth/react";
import { api } from "@/utils/api";

interface ChatFormProps {
  chatId: string;
}

const ChatForm = ({ ...props }: ChatFormProps) => {
  const { data: sessionData } = useSession();
  const userId = sessionData ? sessionData.user.id : "";
  const { chatId } = props;
  const ctx = api.useContext();

  const {
    mutate: createMessage,
    isLoading,
    isError,
  } = api.chat.createMessage.useMutation({
    onSuccess: async () => {
      return await ctx.chat.getChat.invalidate({ id: chatId });
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = e.currentTarget.elements.namedItem(
      "message"
    ) as HTMLInputElement;
    createMessage({ text: text.value, userId: userId, chatId: chatId });
    text.value = "";
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full gap-2 border-t border-neutral bg-base-300 p-2"
    >
      <input
        className="input-bordered input input-sm w-full bg-base-200"
        min={1}
        max={255}
        required
        placeholder="Type a message..."
        name="message"
        type="text"
      />
      <button
        className="btn-sm btn border border-neutral"
        type="submit"
        disabled={!userId}
      >
        {isLoading ? <span className="loading loading-dots h-6 w-6" /> : "Send"}
      </button>
    </form>
  );
};

export default ChatForm;
