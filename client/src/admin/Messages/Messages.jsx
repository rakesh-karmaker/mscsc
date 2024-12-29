import { useMessages } from "@/admin/contexts/MessagesContext";
import Table from "@/components/UI/Table/Table";
import { deleteMessage } from "@/services/DeleteService";
import { editMessage } from "@/services/PutService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "@/admin/components/DashboardHeader/DashboardHeader";
import "./Messages.css";
import { useState } from "react";
import InputText from "@/components/UI/InputText/InputText";
import { useEffect } from "react";

const Messages = () => {
  const { messages: data } = useMessages();
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState(data);

  useEffect(() => {
    if (search) {
      setMessages(
        data.filter((message) =>
          message.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setMessages(data);
    }
  }, [search]);

  const queryClient = useQueryClient();
  const messagesMutation = useMutation({
    mutationFn: (data) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMessage(rest);
      } else {
        return editMessage(rest);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries("messages");
      toast.success("Operation successful!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  const onViewClick = (id) => {
    messagesMutation.mutate({ newMember: false, _id: id, isDelete: false });
  };

  const onDelete = (id) => {
    messagesMutation.mutate({ _id: id, isDelete: true });
  };

  return (
    <div className="admin-messages">
      <DashboardHeader title={"Messages"}>
        View all the messages sent by members
      </DashboardHeader>
      <div className="search">
        <InputText id={"messagesSearch"} setSearch={setSearch}>
          Search Messages
        </InputText>
      </div>
      <Table
        headers={messageTableHeader}
        data={messages}
        onViewClick={onViewClick}
        onDelete={onDelete}
      />
      <Toaster position="top-right" />
    </div>
  );
};

const messageTableHeader = [
  {
    title: "Name",
    key: "name",
    break: false,
  },
  {
    title: "Email",
    key: "email",
    break: false,
  },
  {
    title: "Subject",
    key: "subject",
    break: true,
  },
  {
    title: "View",
    key: "btn",
    break: false,
  },
  {
    title: "Action",
    key: "btn",
    break: false,
  },
];

export default Messages;
