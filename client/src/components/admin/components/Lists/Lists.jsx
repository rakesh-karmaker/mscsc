import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { editMessage, editUser } from "@/services/PutService";
import Dialog from "@/components/admin/components/Dialog/Dialog";
import { deleteMember, deleteMessage } from "@/services/DeleteService";
import { NavLink } from "react-router-dom";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";

import "./Lists.css";
import EmptyData from "@/components/UI/EmptyData/EmptyData";

const ListsLayout = ({ title, children }) => {
  return (
    <div className="lists">
      <p className="list-title">{title}</p>
      <ul>{children}</ul>
    </div>
  );
};

const MemberList = ({ members }) => {
  const queryClient = useQueryClient();
  const memberMutation = useMutation({
    mutationFn: (data) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMember(rest);
      } else {
        return editUser(rest);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries("members");
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  const onDelete = (slug) => {
    memberMutation.mutate({ slug: slug, isDelete: true });
  };
  return (
    <ListsLayout title="Members List">
      {members?.slice(0, 6).map((member) => {
        return (
          <li key={member._id}>
            <MemberListItem member={member} onDelete={onDelete} />
          </li>
        );
      })}
    </ListsLayout>
  );
};

const MemberListItem = ({ member, onDelete }) => {
  return (
    <NavLink
      className={member.new ? "new" : ""}
      onClick={() => {
        member.new
          ? memberMutation.mutate({
              new: false,
              slug: member.slug,
              isDelete: false,
            })
          : null;
      }}
      to={`/member/${member.slug}`}
    >
      <div className="image-info">
        <img src={member.image} alt={member.name} />
        <div className="info">
          <p className="member-name">{member.name}</p>
          <p className="member-branch-batch">
            {member.branch}, {member.batch}
          </p>
        </div>
      </div>
      <DeleteBtn slug={member.slug} deleteFunc={onDelete}>
        Are you sure you want to delete this member?
      </DeleteBtn>
    </NavLink>
  );
};

const MessagesList = ({ messages }) => {
  const queryClient = useQueryClient();
  const messageMutation = useMutation({
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "edit") {
        return editMessage(rest);
      } else if (method == "delete") {
        return deleteMessage({ _id: rest._id });
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
      messageMutation.mutate({ _id: _id, new: false, method: "edit" });
    }
    const message = messages.find((message) => message._id === _id);
    setCurrentMessage(message);
  };
  return (
    <ListsLayout title="Messages List">
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
      <Dialog data={currentMessage} setData={setCurrentMessage} />
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
        <p className="message-subject">
          {message.subject.slice(0, 30)}
          {message.subject.length > 30 ? "..." : ""}
        </p>
        <p className="message-email">{message.email}</p>
      </div>
      <button
        className="danger-button primary-button"
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

export { MessagesList, MemberList };
