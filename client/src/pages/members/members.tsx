import { type ReactNode } from "react";
import { useMembers } from "@/contexts/members-context";
import Loader from "@/components/ui/loader/loader";
import SearchInput from "@/components/ui/search-input/search-input";
import BranchTags from "@/components/members/branch-tags";
import MembersContainer from "@/components/members/members-container";
import { Helmet } from "react-helmet-async";

import "./members.css";

export default function MemberPage(): ReactNode {
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
  } = useMembers();

  return (
    <>
      {/* page metadata */}
      <Helmet>
        <title>MSCSC - Members</title>
        <meta property="og:title" content={`MSCSC - Members`} />
        <meta name="twitter:title" content={`MSCSC - Members`} />
        <meta name="og:url" content={`https://mscsc.netlify.app/members`} />
        <link rel="canonical" href={`https://mscsc.netlify.app/members`} />
      </Helmet>

      {/* page content */}
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
              members={members || []}
              length={length}
              page={page}
              setPage={setPage}
            />
          )}
        </section>
      </main>
    </>
  );
}
