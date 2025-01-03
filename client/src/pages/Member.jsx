import Pagination from "@/components/UI/Pagination/Pagination";
import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { useMember } from "@/contexts/MembersContext";
import { NavLink } from "react-router-dom";

const MemberPage = () => {
  const { response, members, search, setSearch, page, setPage } = useMember();
  return (
    <main className="page-members">
      <h2 className="section-heading">
        Club <span className="highlighted-text">Members</span>
      </h2>

      <div className="filter-members">
        <SearchInput search={search} setSearch={setSearch}>
          Search members
        </SearchInput>
        <BranchTags />
      </div>

      <section className="members-container">
        {members?.map((member) => {
          return <MemberCard key={member._id + member.name} member={member} />;
        })}
        <Pagination
          length={response?.totalLength}
          elementsPerPage={16}
          currentPage={page}
          setPage={setPage}
        />
      </section>
    </main>
  );
};

const MemberCard = ({ member }) => {
  const { _id: id, name, branch, batch, image } = member;
  return (
    <NavLink to={`/member/${id}`} className="member-card">
      <img src={image} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{branch}</p>
        <p>{batch}</p>
      </div>
    </NavLink>
  );
};

const BranchTags = () => {
  const branches = [
    "Branch - 1",
    "Branch - 2",
    "Branch - 3",
    "Main Boys",
    "Main Girls",
  ];
  const { branch, setBranch } = useMember();

  return (
    <div className="branch-tags">
      {branches.map((branchName) => {
        return (
          <button
            key={branchName}
            className={branch === branchName ? "active" : ""}
            onClick={() => setBranch(branchName)}
          >
            {branchName}
          </button>
        );
      })}
    </div>
  );
};

export default MemberPage;
