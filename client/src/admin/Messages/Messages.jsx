import { useMessages } from "@/admin/contexts/MessagesContext";
import Table from "@/components/UI/Table/Table";
import { deleteMessage } from "@/services/DeleteService";
import { editMessage } from "@/services/PutService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "@/admin/components/DashboardHeader/DashboardHeader";
import "./Messages.css";
import "@/components/UI/InputText/InputText.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Messages = () => {
  const queryClient = useQueryClient();
  const { messages: data } = useMessages();
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState(data);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    setMessages(data);
    setSearch("");
  }, [data]);

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
    queryClient.invalidateQueries("messages");
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
        onViewClick={onViewClick}
        onDelete={onDelete}
      />
      <Dialog data={currentMessage} setData={setCurrentMessage} />
      <Toaster position="top-right" />
    </div>
  );
};

const Dialog = ({ data, setData }) => {
  return (
    <div className={`dialog-container ${data ? "open" : ""}`}>
      <dialog className="message-dialog" open={data ? true : false}>
        <div className="message-info">
          <div className="message-name-container">
            <h2>{data?.name}</h2>
            <button onClick={() => setData(null)} className="close">
              <i className="fa-solid fa-x"></i>
            </button>
          </div>
          <p className="message-email highlighted-text">{data?.email}</p>
        </div>
        <div className="subject">
          <h3>Subject</h3>
          <p>{data?.subject}</p>
        </div>
        <div className="message">
          <h3>Message</h3>
          <p>{data?.message}</p>
        </div>
        <Link to={`mailto:${data?.email}`} className="reply primary-button">
          Reply
          <span className="reply-icon">
            <i className="fa-solid fa-reply fa-flip-horizontal"></i>
          </span>
        </Link>
      </dialog>
    </div>
  );
};

const SearchInput = ({ search, setSearch }) => {
  const [top, setTop] = useState(search ? "-25px" : "0");
  return (
    <div className="search">
      <form className="input-text">
        <div className="input-container">
          <label htmlFor="search" style={{ top: top }}>
            Search by name
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => {
              setTop(e.target.value ? "-25px" : "0");
              setSearch(e.target.value);
            }}
          />
        </div>
      </form>
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
