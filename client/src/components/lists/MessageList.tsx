import { deleteMessage, markMessageAsRead } from "@/lib/api/message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import type { MessageType } from "@/types/messageTypes";
import ListLayout from "./ListLayout";
import Empty from "../ui/empty/Empty";
import MessageBox from "../MessageBox";

export default function MessageList({ messages }: { messages: MessageType[] }) {
  const queryClient = useQueryClient();

  const messageMutation = useMutation({
    mutationFn: (data: { _id: string; method: "mark" | "delete" }) => {
      const { method, ...rest } = data;
      if (method === "mark") {
        return markMessageAsRead(rest._id);
      } else if (method === "delete") {
        return deleteMessage(rest._id);
      }
      // Always return a rejected Promise for unexpected cases
      return Promise.reject(new Error("Invalid method"));
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  function messageDelete(_id: string) {
    messageMutation.mutate({ _id: _id, method: "delete" });
  }

  const [currentMessage, setCurrentMessage] = useState<MessageType | null>(
    null
  );

  function messageClick(_id: string, isNew: boolean) {
    if (isNew === true) {
      messageMutation.mutate({ _id: _id, method: "mark" });
    }
    const message = messages.find((message) => message._id === _id);
    setCurrentMessage(message ?? null);
  }

  return (
    <ListLayout title="Message List">
      {!messages || messages?.length == 0 ? (
        <Empty />
      ) : (
        messages?.slice(0, 6).map((message) => {
          return (
            <li key={message._id}>
              <MessagesListItem
                message={message}
                messageClick={messageClick}
                messageDelete={messageDelete}
              />
            </li>
          );
        })
      )}
      <MessageBox data={currentMessage} setData={setCurrentMessage} />
    </ListLayout>
  );
}

function MessagesListItem({
  message,
  messageClick,
  messageDelete,
}: {
  message: MessageType;
  messageClick: (_id: string, isNew: boolean) => void;
  messageDelete: (_id: string) => void;
}) {
  return (
    <div
      className={message.new ? "new" : ""}
      onClick={() => messageClick(message._id, message.new)}
    >
      <div className="info">
        <p className="message-subject line-clamp-2">{message.subject}</p>
        <p className="message-email line-clamp-2">{message.email}</p>
      </div>
      <button
        className="danger-button primary-button !text-[1em] !py-[7px] !px-[15px] !w-fit !h-fit"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          messageDelete(message._id);
        }}
      >
        Delete
      </button>
    </div>
  );
}
