import { deleteMember, editMember } from "@/lib/api/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import type { MemberPreview } from "@/types/member-types";
import DeleteWarning from "../ui/delete-warning";
import ListLayout from "./list-layout";

export default function MemberList({ members }: { members: MemberPreview[] }) {
  const queryClient = useQueryClient();
  const memberMutation = useMutation({
    mutationFn: (data: { slug: string; isDelete: boolean; new?: boolean }) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMember(rest);
      } else {
        return editMember({ slug: data.slug, new: false });
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success(res?.data?.message);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Operation failed!");
    },
  });

  const onDelete = (slug: string) => {
    memberMutation.mutate({ slug: slug, isDelete: true });
  };

  const onNewClick = (slug: string) => {
    memberMutation.mutate({ new: false, slug: slug, isDelete: false });
  };

  return (
    <ListLayout title="Member List">
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
    </ListLayout>
  );
}

function MemberListItem({
  member,
  onDelete,
  onNewClick,
}: {
  member: MemberPreview;
  onDelete: (slug: string) => void;
  onNewClick: (slug: string) => void;
}) {
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
          className="danger-button primary-button text-[1em]! py-1.75! px-3.75! w-fit! h-fit!"
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
}
