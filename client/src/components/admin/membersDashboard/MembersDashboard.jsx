import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import "./MembersDashboard.css";
import MemberPage from "@/pages/members/Members";
import { editUser } from "@/lib/api/auth";
import { deleteMember } from "@/lib/api/member";

const MembersDashboard = ({
  type,
  title = "Members",
  des = "View all the members of the club",
}) => {
  const queryClient = useQueryClient();
  const membersMutation = useMutation({
    mutationFn: (data) => {
      const { isDelete, ...rest } = data;
      if (isDelete) {
        return deleteMember(rest);
      } else {
        return editUser(rest);
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
  const onDelete = (id) => {
    membersMutation.mutate({ _id: id, isDelete: true });
  };

  const onRoleClick = (id, role) => {
    membersMutation.mutate({
      _id: id,
      role: role === "admin" ? "member" : "admin",
    });
  };

  return (
    <>
      <div className="admin-members">
        <DashboardHeader title={title}>{des}</DashboardHeader>

        <MemberPage
          isAdmin={true}
          deleteMember={onDelete}
          changeRole={onRoleClick}
          showExecutives={type === "executive"}
          showAdmins={type === "admin"}
        />
      </div>
    </>
  );
};

export default MembersDashboard;
