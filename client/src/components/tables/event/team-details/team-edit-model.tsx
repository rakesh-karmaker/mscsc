import Modal from "@mui/material/Modal";
import { useState, type ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";
import type { EventTeamData } from "@/types/event-types";
import TeamEditForm from "./team-edit-form";

interface TeamEditModelProps {
  teamData: EventTeamData;
  setDetailsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TeamEditModel({
  teamData,
  setDetailsModelOpen,
}: TeamEditModelProps): ReactNode {
  const [editTeamModelOpen, setEditTeamModelOpen] = useState<boolean>(false);

  return (
    <div>
      <button
        type="button"
        className={
          "w-full h-full flex text-center justify-center rounded-sm items-center px-3! py-1! max-w-fit bg-highlighted-color text-white hover:bg-secondary-bg/20 hover:text-black border border-highlighted-color/20  duration-200 mt-1! transition-all cursor-pointer"
        }
        onClick={(e) => {
          e.stopPropagation();
          setEditTeamModelOpen(true);
        }}
      >
        Edit Team
      </button>

      <Modal
        open={editTeamModelOpen}
        onClose={() => setEditTeamModelOpen(false)}
        aria-labelledby="Team Edit Box"
        aria-describedby="Edit Team Details"
        className="flex items-center justify-center h-fit min-h-screen max-sm:overflow-y-auto absolute max-sm:bg-primary-bg border-none! outline-none! focus-visible:outline-none"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="w-full max-w-[28.75em] max-sm:max-w-full max-sm:min-h-screen bg-primary-bg max-h-[90vh] max-sm:max-h-screen overflow-y-auto border-none! outline-none! focus-visible:outline-none rounded-lg">
          <div className="min-h-fit max-sm:max-h-full p-7! rounded-lg max-sm:rounded-none bg-primary-bg flex flex-col max-sm:justify-center gap-5">
            <div className="w-full flex flex-col">
              <div className="w-full flex justify-between items-start gap-4">
                <h2 className="text-2xl font-medium max-xs:text-2xl">
                  Team Edit
                </h2>
                <button
                  onClick={() => setEditTeamModelOpen(false)}
                  className="text-3xl transition-all duration-200 hover:text-red-400 cursor-pointer"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="w-full h-px bg-light-black/10 mt-2! mb-7!"></div>
              <TeamEditForm
                teamData={teamData}
                setIsOpen={setEditTeamModelOpen}
                setDetailsModelOpen={setDetailsModelOpen}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
