import type { Dispatch, ReactNode, SetStateAction } from "react";

export default function BranchTags({
  branch,
  setBranch,
}: {
  branch: string;
  setBranch: Dispatch<SetStateAction<string>>;
}): ReactNode {
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
}
