import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { useMember } from "@/contexts/MembersContext";
import "./Members.css";
import Loader from "@/components/UI/Loader/Loader";
import MembersContainer from "@/components/membersComponents/MembersContainer";
import { useEffect } from "react";

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
    isLoading,
  } = useMember();

  //reset search and branch when page reloads
  useEffect(() => {
    setSearch("");
    setBranch("");
  }, []);

  return (
    <>
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
          {isLoading ? (
            <Loader />
          ) : (
            <MembersContainer
              members={members}
              length={length}
              page={page}
              setPage={setPage}
              {...props}
            />
          )}
        </section>
      </main>
    </>
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
