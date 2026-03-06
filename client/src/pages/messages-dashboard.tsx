import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState, type ReactNode } from "react";
import { deleteMessage, markMessageAsRead } from "@/lib/api/message";
import type { MessageTableData } from "@/types/message-types";
import AdminDashboardHeader from "@/components/ui/admin-dashboard-header";
import MessageBox from "@/components/message-box";
import { Helmet } from "react-helmet-async";
import MessagesTable from "@/components/tables/messages-table/messages-table";

export default function MessagesDashboard(): ReactNode {
  const queryClient = useQueryClient();
  const [currentMessage, setCurrentMessage] = useState<MessageTableData | null>(
    null,
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

  const onViewClick = (message: MessageTableData) => {
    if (message.new === true) {
      messagesMutation.mutate({ _id: message._id, isDelete: false });
    }
    setCurrentMessage(message);
  };

  const onDelete = (id: string) => {
    messagesMutation.mutate({ _id: id, isDelete: true });
  };

  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Messages Dashboard</title>
        <meta property="og:title" content={`MSCSC - Messages Dashboard`} />
        <meta name="twitter:title" content={`MSCSC - Messages Dashboard`} />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/admin/messages`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/admin/messages`}
        />
      </Helmet>

      {/* page content */}
      <div className="w-full h-full min-h-[calc(100svh-60px)] flex flex-col gap-13">
        <AdminDashboardHeader title={"Messages"}>
          View all the messages sent by members
        </AdminDashboardHeader>

        <MessagesTable onViewClick={onViewClick} onDelete={onDelete} />
        <MessageBox data={currentMessage} setData={setCurrentMessage} />
      </div>
    </>
  );
}
