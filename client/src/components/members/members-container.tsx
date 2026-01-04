import Empty from "@/components/ui/empty/empty";
import type { MemberPreview } from "@/types/member-types";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import MemberCard from "./member-card/member-card";
import PaginationContainer from "@/components/ui/pagination-container/pagination-container";

export default function MembersContainer({
  members,
  length,
  page,
  setPage,
  ...props
}: {
  members: MemberPreview[];
  length: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}): ReactNode {
  if (length === 0) return <Empty />;
  return (
    <>
      <div className="members-container">
        {members?.map((member) => {
          return (
            <MemberCard
              key={member._id + member.slug}
              member={member}
              {...props}
            />
          );
        })}
      </div>
      <PaginationContainer
        length={length}
        elementsPerPage={12}
        currentPage={page}
        setPage={setPage}
      />
    </>
  );
}
