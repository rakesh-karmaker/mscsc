import type { MemberPreview } from "@/types/member-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SelectInput from "../ui/select-input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memberEditSchema,
  type MemberEditSchema,
} from "@/lib/validation/member-edit-schema";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import { deleteMember, editMember } from "@/lib/api/member";
import DeleteWarning from "@/components/ui/delete-warning";

export type MemberMutationProps = {
  method: string;
  slug: string;
  isImageVerified?: boolean;
  isImageHidden?: boolean;
  position?: string;
  role?: string;
};

export default function MemberEditForm({
  member,
  setIsOpen,
}: {
  member: MemberPreview;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(memberEditSchema),
    defaultValues: {
      position: member?.position,
      role: member?.role,
      showImage: member?.isImageVerified ? true : false,
    },
    mode: "onChange",
  });

  const memberMutation = useMutation({
    mutationFn: (props: MemberMutationProps) => {
      const { method, ...data } = props;
      if (method == "edit") {
        console.log("Editing member with data:", data);
        return editMember(data);
      } else {
        return deleteMember({ slug: data.slug });
      }
    },
    onSuccess: () => {
      toast.success("Edited Successfully!");
    },
    onError: () => {
      toast.error("Failed to edit member");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsOpen(false);
    },
  });

  const editMemberFunc = (data: MemberEditSchema) => {
    memberMutation.mutate({
      method: "edit",
      slug: member.slug,
      isImageVerified: data.showImage,
      isImageHidden: !data.showImage,
      position: data.position,
      role: data.role,
    });
  };

  const onDelete = (slug: string) => {
    memberMutation.mutate({
      method: "delete",
      slug: slug,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(editMemberFunc)}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-5">
          <TextField
            {...register("position")}
            id="position"
            label="Position"
            variant="outlined"
            error={!!errors.position}
            helperText={errors.position?.message}
          />

          <SelectInput
            name="role"
            control={control}
            errors={errors}
            dataList={[
              {
                value: "member",
                label: "Member",
              },
              {
                value: "admin",
                label: "Admin",
              },
            ]}
          >
            Set Role
          </SelectInput>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={member?.isImageVerified ? true : false}
              {...register("showImage")}
            />
          }
          label={<span>Show image</span>}
        />

        <div className="edit-dialog-actions flex flex-wrap gap-2.5">
          <button
            type="submit"
            className="primary-button !text-[1.1em] !py-[10px] !px-[20px] !w-fit !h-fit"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Save
          </button>

          <button
            className="danger-button primary-button !text-[1.1em] !py-[10px] !px-[20px] !w-fit !h-fit"
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
        slug={member.slug}
        deleteFunc={onDelete}
        open={open}
        setOpen={setOpen}
        title="Delete Member"
      >
        This will permanently delete this member{" "}
        <span className="font-semibold">{member.name}</span> from the member's
        list and remove all of their data from the server. All of their images,
        links, and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
}
