import { deleteMessage, markMessageAsRead } from "@/lib/api/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { ListsLayout } from "./Lists";
import EmptyData from "@/components/UI/EmptyData/EmptyData";
import { MessageBox } from "../MessageBox";

export const MessageList = ({ messages }) => {
  const queryClient = useQueryClient();
  const messageMutation = useMutation({
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "mark") {
        return markMessageAsRead(rest._id);
      } else if (method == "delete") {
        return deleteMessage(rest._id);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries("messages");
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  const messageDelete = (_id) => {
    messageMutation.mutate({ _id: _id.toString(), method: "delete" });
  };

  const [currentMessage, setCurrentMessage] = useState(null);
  const messageClick = (_id, isNew) => {
    if (isNew === true) {
      messageMutation.mutate({ _id: _id, method: "mark" });
    }
    const message = messages.find((message) => message._id === _id);
    setCurrentMessage(message);
  };
  return (
    <ListsLayout title="Message List">
      {!messages || messages?.length == 0 ? (
        <EmptyData />
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
    </ListsLayout>
  );
};

const MessagesListItem = ({ message, messageClick, messageDelete }) => {
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
};
