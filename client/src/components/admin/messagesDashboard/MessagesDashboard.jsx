import { useMessages } from "@/components/admin/contexts/MessagesContext";
import Table from "@/components/UI/Table/Table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardHeader from "@/components/admin/components/DashboardHeader/DashboardHeader";
import "./MessagesDashboard.css";
import { useState } from "react";
import Dialog from "@/components/admin/components/Dialog/Dialog";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import Loader from "@/components/UI/Loader/Loader";
import { deleteMessage, editMessage } from "@/lib/api/messages";
import { messageTableHeader } from "@/services/data/data";

const MessagesDashboard = () => {
  const queryClient = useQueryClient();
  const { length, messages, search, setSearch, isLoading, page, setPage } =
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
    if (isNew === true) {
      messagesMutation.mutate({ _id: id, isDelete: false, new: false });
    }
    const message = messages.find((message) => message._id === id);
    setCurrentMessage(message);
  };

  const onDelete = (id) => {
    messagesMutation.mutate({ _id: id, isDelete: true });
  };

  return (
    <>
      <div className="admin-messages">
        <DashboardHeader title={"Messages"}>
          View all the messages sent by members
        </DashboardHeader>
        <SearchInput search={search} setSearch={setSearch}>
          Search Messages
        </SearchInput>

        <div className="messages-container">
          {isLoading ? (
            <Loader />
          ) : (
            <Table
              headers={messageTableHeader}
              data={messages}
              length={length}
              page={page}
              setPage={setPage}
              onViewClick={onViewClick}
              onDelete={onDelete}
            />
          )}
        </div>

        <Dialog data={currentMessage} setData={setCurrentMessage} />
      </div>
    </>
  );
};

export default MessagesDashboard;
