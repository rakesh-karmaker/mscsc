import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { deleteMember, editUser } from "@/lib/api/member";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { ListsLayout } from "./Lists";

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
  return (
    <NavLink
      className={member.new ? "new" : ""}
      onClick={() => {
        if (member.new) {
          onNewClick(member.slug);
        }
      }}
      to={`/member/${member.slug}`}
    >
      <div className="member-info">
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
