import { deleteMember, editUser } from "@/lib/api/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { ListsLayout } from "./Lists";
import { DeleteWarning } from "@/components/UI/DeleteWarning";
import { useState } from "react";

export const MemberList = ({ members }) => {
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

  const onNewClick = (slug) => {
    memberMutation.mutate({ new: false, slug: slug, isDelete: false });
  };

  return (
    <ListsLayout title="Member List">
      {members?.slice(0, 6).map((member) => {
        return (
          <li key={member._id}>
            <MemberListItem
              member={member}
              onDelete={onDelete}
              onNewClick={onNewClick}
            />
          </li>
        );
      })}
    </ListsLayout>
  );
};

const MemberListItem = ({ member, onDelete, onNewClick }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavLink
        className={member.new ? "new" : ""}
        onClick={() => {
          if (member.new) {
            onNewClick(member.slug);
          }
        }}
        to={`/member/${member.slug}`}
      >
        <div className="member-short-info">
          <img src={member.image} alt={member.name} />
          <div className="info">
            <p className="member-name">{member.name}</p>
            <p className="member-branch-batch">
              {member.branch}, {member.batch}
            </p>
          </div>
        </div>

        <button
          className="danger-button primary-button !text-[1em] !py-[7px] !px-[15px] !w-fit !h-fit"
          aria-label="Delete this data"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpen(true);
          }}
        >
          Delete
        </button>
      </NavLink>

      <DeleteWarning
        slug={member.slug}
        deleteFunc={onDelete}
        open={open}
        setOpen={setOpen}
        title="Delete Member"
      >
        This will permanently delete this member{" "}
        <span className="font-semibold">{member.name}</span> from the member's
        list and remove all of their data from the server. All of their images,
        links, and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
};
