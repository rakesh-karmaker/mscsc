import SearchInput from "@/components/UI/SearchInput/SearchInput";
import { useMember } from "@/contexts/MembersContext";
import "@/components/members-components/Members.css";
import Loader from "@/components/UI/Loader/Loader";
import MembersContainer from "@/components/members-components/MembersContainer";
import MetaTags from "@/layout/MetaTags";

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

  return (
    <>
      <MetaTags
        title="MSCSC - Members"
        description="MSCSC is the ideal place for Math, Science, Biology, IT, and Astronomy enthusiasts, offering top-notch learning, hands-on experiences, and expert guidance."
      />
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
