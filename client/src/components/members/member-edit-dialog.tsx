import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Modal } from "@mui/material";
import { editMember } from "@/lib/api/member";
import { FaXmark } from "react-icons/fa6";
import type { MemberTableData } from "@/types/member-types";
import MemberEditForm from "@/components/forms/member-edit-form";

export default function MemberEditDialog({
  member,
}: {
  member: MemberTableData;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const memberNewMutation = useMutation({
    mutationFn: () => editMember({ slug: member.slug || "", new: false }),
  });

  return (
    <div className="p-2! px-1! border-t border-gray-300">
      <button
        type="button"
        className={
          "w-full h-full flex text-center justify-center rounded-sm items-center px-1! py-1! hover:bg-[#f5f5f5] transition-all cursor-pointer"
        }
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
          if (member?.new) {
            console.log("Marking member as old - ", member.slug);
            memberNewMutation.mutate();
          }
        }}
      >
        Edit Member
      </button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="Member Edit Box"
        aria-describedby="Edit Member Details"
        className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
          <div className="min-h-fit max-sm:max-h-full p-7! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between items-center gap-2">
                <h2 className="text-2xl font-medium max-xs:text-2xl">
                  Edit Member - {member.name}
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="w-full h-px bg-light-black/10 mt-2! mb-7!"></div>
              <MemberEditForm member={member} setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
