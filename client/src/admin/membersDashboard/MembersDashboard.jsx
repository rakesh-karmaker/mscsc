import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "@/services/DeleteService";
import { editUser } from "@/services/PutService";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import "./MembersDashboard.css";
import MemberPage from "@/pages/members/Members";

const MembersDashboard = () => {
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
    console.log("Delete member");
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
        <DashboardHeader title={"Members"}>
          View all the members of the club
        </DashboardHeader>

        <MemberPage
          isAdmin={true}
          deleteMember={onDelete}
          changeRole={onRoleClick}
        />
      </div>
    </>
  );
};

export default MembersDashboard;
