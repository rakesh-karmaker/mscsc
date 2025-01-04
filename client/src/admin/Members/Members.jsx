import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMember } from "@/contexts/MembersContext";
import { deleteMember } from "@/services/DeleteService";
import { editUser } from "@/services/PutService";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import "./Members.css";
import CheckBox from "@/components/UI/Checkbox/Checkbox";
import MemberPage from "@/pages/Member";

const Members = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { response, members, search, setSearch, setRole, page, setPage } =
    useMember();

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
  );
};

export default Members;
