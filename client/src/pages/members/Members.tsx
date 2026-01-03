import { useEffect, type ReactNode } from "react";
import { useMembers } from "@/contexts/members-context";
import Loader from "@/components/ui/loader/loader";
import SearchInput from "@/components/ui/search-input/search-input";
import BranchTags from "@/components/members/branch-tags";
import MembersContainer from "@/components/members/members-container";

import "./members.css";

export default function MemberPage(props: {
  showExecutives?: boolean;
  showAdmins?: boolean;
  isAdmin?: boolean;
}): ReactNode {
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
    position,
    setPosition,
    role,
    setRole,
  } = useMembers();

  //reset search and branch when page reloads
  useEffect(() => {
    if (props?.showExecutives) {
      if (position !== "executive") {
        setPosition("executive");
        setRole("");
      }
    } else if (props?.showAdmins) {
      if (role !== "admin") {
        setRole("admin");
        setPosition("");
      }
    } else {
      setPosition("");
      setRole("");
    }

    setSearch("");
    setBranch("");
  }, [, props]);

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
              members={members || []}
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
}
