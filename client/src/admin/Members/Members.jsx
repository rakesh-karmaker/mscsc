import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMember } from "@/services/DeleteService";
import { editUser } from "@/services/PutService";
import toast, { Toaster } from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import "./Members.css";
import MemberPage from "@/pages/Member";
import MetaTags from "@/layout/MetaTags";

const Members = () => {
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
      <MetaTags
        title="Admin - Members"
        description="MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy enthusiasts, offering top-notch learning, hands-on experiences, and expert guidance."
      />
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

export default Members;
