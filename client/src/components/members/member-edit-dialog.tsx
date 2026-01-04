import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@mui/material";
import { editMember } from "@/lib/api/member";
import { FaXmark } from "react-icons/fa6";
import type { MemberPreview } from "@/types/member-types";
import MemberEditForm from "@/components/forms/member-edit-form";

export default function MemberEditDialog({
  member,
}: {
  member: MemberPreview;
}) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const memberNewMutation = useMutation({
    mutationFn: () => editMember({ slug: member?.slug || "", new: false }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return (
    <>
      <div className="member-edit-btn-container" style={{ cursor: "initial" }}>
        <button
          type="button"
          className={`primary-button  ${member?.new ? "before:!bg-green" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            if (member?.new) {
              memberNewMutation.mutate();
            }
          }}
        >
          Edit Member
        </button>
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="Member Edit Box"
        aria-describedby="Edit Member Details"
        className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg !border-none !outline-none focus-visible:outline-none"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto !border-none !outline-none focus-visible:outline-none rounded-lg">
          <div className="min-h-fit max-sm:max-h-full !p-7 rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between items-center gap-2">
                <h2 className="text-2xl font-medium max-xs:text-2xl">
                  Edit Member
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="w-full h-[1px] bg-light-black/10 !mt-2 !mb-7"></div>
              <MemberEditForm member={member} setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
