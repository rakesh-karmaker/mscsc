import { deleteMember, editMember } from "@/lib/api/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import type { AdminDashboardMemberPreview } from "@/types/member-types";
import DeleteWarning from "../ui/delete-warning";
import ListLayout from "./list-layout";
import dayjs from "dayjs";

export default function MemberList({
  members,
  loading,
}: {
  members: AdminDashboardMemberPreview[];
  loading: boolean;
}) {
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
      queryClient.invalidateQueries({ queryKey: ["adminDashboardData"] });
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

  return (
    <ListLayout title="Member List" isLoading={loading}>
      {members?.slice(0, 6).map((member) => {
        return (
          <li key={member._id}>
            <MemberListItem member={member} onDelete={onDelete} />
          </li>
        );
      })}
    </ListLayout>
  );
}

function MemberListItem({
  member,
  onDelete,
}: {
  member: AdminDashboardMemberPreview;
  onDelete: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasRegistered7DaysAgo =
    dayjs().diff(dayjs(member.createdAt), "day") <= 7;

  return (
    <>
      <NavLink
        className={hasRegistered7DaysAgo ? "new" : ""}
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
