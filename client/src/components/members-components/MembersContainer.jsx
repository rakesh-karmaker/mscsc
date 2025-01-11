import Pagination from "@/components/UI/Pagination/Pagination";
import MemberCard from "@/components/members-components/memberCard/MemberCard";
import EmptyData from "@/components/UI/EmptyData/EmptyData";

const MembersContainer = ({ members, length, page, setPage, ...props }) => {
  if (length === 0) return <EmptyData />;
  return (
    <>
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
    </>
  );
};

export default MembersContainer;
