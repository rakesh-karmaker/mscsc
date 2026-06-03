import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import DeleteWarning from "@/components/ui/delete-warning";
import type { EventTeamData } from "@/types/event/event-team-types";
import { teamEditSchema } from "@/lib/validation/team-edit-schema";
import { deleteTeamById, editTeam } from "@/lib/api/event/event-teams";
import { useParams } from "react-router-dom";
import SelectInput from "@/components/ui/select-input";

export type TeamEditMutationProps = {
  method: string;
  teamName: string;
  leaderEmail: string;
  status: "registering" | "pending" | "approved";
  memberEmails?: string[];
};

export default function TeamEditForm({
  teamData,
  setIsOpen,
  setDetailsModelOpen,
}: {
  teamData: EventTeamData;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setDetailsModelOpen: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  const queryClient = useQueryClient();
  const eventSlug = useParams().eventSlug!;

  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<"edit" | "delete">("edit");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamEditSchema),
    defaultValues: {
      teamName: teamData.teamName,
      leaderEmail: teamData.leaderEmail,
      status: teamData.status,
      memberEmails: teamData.memberEmails,
    },
    mode: "onChange",
  });

  const teamEditMutation = useMutation({
    mutationFn: (props: TeamEditMutationProps) => {
      const { method, ...data } = props;
      if (method == "edit") {
        return editTeam(eventSlug, teamData._id, data);
      } else {
        return deleteTeamById(eventSlug, teamData._id);
      }
    },
    onSuccess: () => {
      toast.success("Edited Successfully!");
    },
    onError: (res: any) => {
      toast.error(
        res.response?.data?.message || "Failed to edit team. Please try again.",
      );
    },
    onSettled: () => {
      const keys = [
        teamData.leaderRegistration
          ? `registration-${eventSlug}-${teamData.leaderRegistration._id}`
          : null,
        `team-${eventSlug}-${teamData._id}`,
      ];

      for (const member of teamData.memberRegistrations || []) {
        if (member && member._id) {
          keys.push(`registration-${eventSlug}-${member._id}`);
        }
      }

      queryClient.invalidateQueries({
        queryKey: keys.filter((key): key is string => key !== null),
      });
      if (method === "delete") {
        setDetailsModelOpen(false);
      }
      setIsOpen(false);
    },
  });

  const editTeamFunc = (data: Omit<TeamEditMutationProps, "method">) => {
    teamEditMutation.mutate({
      method: "edit",
      teamName: data.teamName,
      leaderEmail: data.leaderEmail,
      status: data.status,
      memberEmails: data.memberEmails,
    });
  };

  const onDelete = (_: string) => {
    setMethod("delete");
    teamEditMutation.mutate({
      method: "delete",
      teamName: "",
      leaderEmail: "",
      status: "registering",
      memberEmails: [],
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(editTeamFunc)}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-5">
          <TextField
            {...register("teamName")}
            id="teamName"
            label="Team Name"
            variant="outlined"
            error={!!errors.teamName}
            helperText={errors.teamName?.message}
          />

          <TextField
            {...register("leaderEmail")}
            id="leaderEmail"
            label="Leader Email"
            variant="outlined"
            error={!!errors.leaderEmail}
            helperText={errors.leaderEmail?.message}
          />

          <TextField
            {...register("memberEmails.0")}
            id="memberEmails"
            label="Member Emails"
            variant="outlined"
            error={!!errors.memberEmails}
          />

          <div className="w-full flex flex-col gap-1">
            <TextField
              {...register("memberEmails.1")}
              id="memberEmails2"
              label="Member Emails 2 (If Applicable)"
              variant="outlined"
              error={!!errors.memberEmails}
            />
          </div>

          <SelectInput
            name="status"
            control={control}
            errors={errors}
            dataList={[
              {
                value: "registering",
                label: "Registering",
              },
              {
                value: "pending",
                label: "Pending",
              },
              {
                value: "approved",
                label: "Approved",
              },
            ]}
          >
            Set Status
          </SelectInput>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {errors.teamName || errors.leaderEmail || errors.memberEmails
              ? "Please fix the above errors before submitting the form."
              : "Please click Save to apply the changes to this team."}
          </p>
        </div>

        <div className="edit-dialog-actions flex flex-wrap gap-2.5">
          <button
            type="submit"
            className="primary-button text-[1em]! py-1.5! px-3.5! w-fit! h-fit!"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Save
          </button>

          <button
            className="danger-button primary-button text-[1em]! py-1.5! px-3.5! w-fit! h-fit!"
            aria-label="Delete this data"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </form>

      <DeleteWarning
        slug={teamData._id}
        deleteFunc={onDelete}
        open={open}
        setOpen={setOpen}
        title="Delete Team"
      >
        This will permanently delete this team from the teams list and remove
        all of their data from the server. All of their images, links, and other
        data will be permanently lost.
      </DeleteWarning>
    </>
  );
}
