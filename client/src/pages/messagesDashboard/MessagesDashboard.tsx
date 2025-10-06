import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, type ReactNode } from "react";
import { messageTableHeader } from "@/services/data/data";
import { useMessages } from "@/contexts/MessagesContext";
import { deleteMessage, markMessageAsRead } from "@/lib/api/message";
import type { MessageType } from "@/types/messageTypes";
import AdminDashboardHeader from "@/components/ui/AdminDashboardHeader";
import SearchInput from "@/components/ui/searchInput/SearchInput";
import Loader from "@/components/ui/loader/Loader";
import MessageBox from "@/components/MessageBox";
import MessageTable from "@/components/tables/messageTable/MessageTable";

import "./messagesDashboard.css";

export default function MessagesDashboard(): ReactNode {
  const queryClient = useQueryClient();
  const { length, messages, search, setSearch, isLoading, page, setPage } =
    useMessages();
  const [currentMessage, setCurrentMessage] = useState<MessageType | null>(
    null
  );

  const messagesMutation = useMutation({
    mutationFn: (data: { _id: string; isDelete: boolean }) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMessage(rest._id);
      } else {
        return markMessageAsRead(rest._id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success("Operation successful!");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  const onViewClick = (id: string, isNew: boolean) => {
    if (isNew === true) {
      messagesMutation.mutate({ _id: id, isDelete: false });
    }
    const message = messages?.find((message) => message._id === id);
    setCurrentMessage(message || null);
  };

  const onDelete = (id: string) => {
    messagesMutation.mutate({ _id: id, isDelete: true });
  };

  return (
    <>
      <div className="admin-messages">
        <AdminDashboardHeader title={"Messages"}>
          View all the messages sent by members
        </AdminDashboardHeader>
        <SearchInput search={search} setSearch={setSearch}>
          Search Messages
        </SearchInput>

        <div className="messages-container">
          {isLoading ? (
            <Loader />
          ) : (
            <MessageTable
              headers={messageTableHeader}
              data={messages || []}
              length={length}
              page={page}
              setPage={setPage}
              onViewClick={onViewClick}
              onDelete={onDelete}
            />
          )}
        </div>

        <MessageBox data={currentMessage} setData={setCurrentMessage} />
      </div>
    </>
  );
}
