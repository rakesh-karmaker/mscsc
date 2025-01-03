import { useMessages } from "@/admin/contexts/MessagesContext";
import Table from "@/components/UI/Table/Table";
import { deleteMessage } from "@/services/DeleteService";
import { editMessage } from "@/services/PutService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "@/admin/components/DashboardHeader/DashboardHeader";
import "./Messages.css";
import { useState } from "react";
import Dialog from "@/admin/components/Dialog/Dialog";
import SearchInput from "@/components/UI/SearchInput/SearchInput";

const Messages = () => {
  const queryClient = useQueryClient();
  const { response, messages, search, setSearch, page, setPage } =
    useMessages();
  const [currentMessage, setCurrentMessage] = useState(null);

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

  const onViewClick = (id, isNew) => {
    if (isNew) {
      messagesMutation.mutate({ _id: id, isDelete: false });
    }
    const message = messages.find((message) => message._id === id);
    setCurrentMessage(message);
  };

  const onDelete = (id) => {
    messagesMutation.mutate({ _id: id, isDelete: true });
  };

  return (
    <div className="admin-messages">
      <DashboardHeader title={"Messages"}>
        View all the messages sent by members
      </DashboardHeader>
      <SearchInput search={search} setSearch={setSearch} />
      <Table
        headers={messageTableHeader}
        data={messages}
        length={response?.totalLength}
        page={page}
        setPage={setPage}
        onViewClick={onViewClick}
        onDelete={onDelete}
      />
      <Dialog data={currentMessage} setData={setCurrentMessage} />
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
