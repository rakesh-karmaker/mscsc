import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMember } from "@/contexts/MembersContext";
import { deleteMember } from "@/services/DeleteService";
import { editUser } from "@/services/PutService";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import Table from "@/components/UI/Table/Table";
import "./Members.css";
import CheckBox from "@/components/UI/Checkbox/Checkbox";

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

  const onViewClick = (id, isNew) => {
    if (isNew) {
      membersMutation.mutate({ _id: id, new: false, isDelete: false });
    }
    navigate(`/profile/${id}`);
  };

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
    <div className="admin-members">
      <DashboardHeader title={"Members"}>
        View all the members of the club
      </DashboardHeader>
      <div className="members-filter">
        <SearchInput search={search} setSearch={setSearch}>
          Search Members
        </SearchInput>
        <CheckBox
          id="admin-only"
          onChange={(e) => {
            e.target.checked ? setRole("admin") : setRole("");
          }}
        >
          Admin Only
        </CheckBox>
      </div>
      <Table
        headers={memberTableHeader}
        data={members}
        length={response?.totalLength}
        page={page}
        setPage={setPage}
        onViewClick={onViewClick}
        onDelete={onDelete}
        onRoleClick={onRoleClick}
      />
    </div>
  );
};

const memberTableHeader = [
  {
    title: "Name",
    key: "name",
    break: false,
  },
  {
    title: "Batch",
    key: "batch",
    break: false,
  },
  {
    title: "Branch",
    key: "branch",
    break: true,
  },
  {
    title: "Reference",
    key: "reference",
    break: true,
  },
  {
    title: "Social Link",
    key: "social",
    break: false,
  },
  {
    title: "Profile",
    key: "btn",
    break: false,
  },
  {
    title: "Action",
    key: "btn",
    break: false,
  },
  {
    title: "Change Role",
    key: "btn",
    break: false,
  },
];

export default Members;
