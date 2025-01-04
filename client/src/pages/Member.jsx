import Pagination from "@/components/UI/Pagination/Pagination";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { useMember } from "@/contexts/MembersContext";
import { useNavigate } from "react-router-dom";

import "@/components/members-components/Members.css";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";

const MemberPage = (props) => {
  const {
    members,
    search,
    setSearch,
    page,
    setPage,
    branch,
    setBranch,
    length,
  } = useMember();

  return (
    <main className="page-members">
      <h2 className="section-heading">
        Club <span className="highlighted-text">Members</span>
      </h2>

      <div className="filter-members">
        <SearchInput
          search={search}
          setSearch={setSearch}
          style={{ maxWidth: "100%", flex: "1" }}
        >
          Search members
        </SearchInput>
        <BranchTags branch={branch} setBranch={setBranch} />
      </div>

      <section className="members-list-container">
        <div className="members-container">
          {members?.map((member) => {
            return (
              <MemberCard
                key={member._id + member.name}
                member={member}
                {...props}
              />
            );
          })}
        </div>
        <Pagination
          length={length}
          elementsPerPage={12}
          currentPage={page}
          setPage={setPage}
        />
      </section>
    </main>
  );
};

const MemberCard = ({ member, ...props }) => {
  const navigate = useNavigate();
  const { _id: id, name, branch, batch, image } = member;
  return (
    <div onClick={() => navigate(`/member/${id}`)} className="member-card">
      <div className="role-icon">
        {member.role === "admin" ? (
          <i className="fa-solid fa-user-tie admin"></i>
        ) : (
          <i className="fas fa-user"></i>
        )}
      </div>
      <div className="member-image-container">
        <img src={image} alt={name} />
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        <p>{branch}</p>
        <p>{batch}</p>
      </div>
      {props?.isAdmin && <MemberActions member={member} {...props} />}
    </div>
  );
};

const MemberActions = ({ member, deleteMember, changeRole }) => {
  return (
    <div className="member-actions">
      <button
        type="button"
        className={`primary-button role-btn ${member?.role}`}
        onClick={(e) => {
          e.stopPropagation();
          changeRole(member._id, member.role);
        }}
      >
        {member?.role === "admin" ? "Make Member" : "Make Admin"}
      </button>
      <DeleteBtn id={member._id} deleteFunc={deleteMember}>
        Are you sure you want to delete this member?
      </DeleteBtn>
    </div>
  );
};

const BranchTags = ({ branch, setBranch }) => {
  const branches = [
    "Branch - 1",
    "Branch - 2",
    "Branch - 3",
    "Main Boys",
    "Main Girls",
  ];

  return (
    <div className="branch-tags">
      {branches.map((branchName) => {
        return (
          <button
            type="button"
            key={branchName}
            className={`branch-tag ${branch === branchName ? "active" : ""}`}
            onClick={() => {
              branch === branchName ? setBranch("") : setBranch(branchName);
            }}
          >
            {branchName}
          </button>
        );
      })}
    </div>
  );
};

export default MemberPage;
