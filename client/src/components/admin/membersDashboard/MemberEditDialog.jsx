import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Checkbox, FormControlLabel, Modal, TextField } from "@mui/material";
import SelectInput from "@/components/UI/SelectInput";
import { deleteMember, editUser } from "@/lib/api/member";
import { DeleteWarning } from "@/components/UI/DeleteWarning";
import { FaXmark } from "react-icons/fa6";

const MemberEditDialog = ({ member, deleteMember: deleteMemberFunc }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const memberNewMutation = useMutation({
    mutationFn: () => editUser({ slug: member?.slug, new: false }),
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
              <EditForm
                member={member}
                setIsOpen={setIsOpen}
                deleteMember={deleteMemberFunc}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const EditForm = ({ member, setIsOpen }) => {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      position: member?.position,
      role: member?.role,
      showImage: member?.isImageVerified ? true : false,
    },
    mode: "onChange",
  });

  const memberMutation = useMutation({
    mutationFn: (props) => {
      const { method, ...data } = props;
      if (method == "edit") {
        return editUser(data);
      } else {
        return deleteMember(data);
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

  const editMemberFunc = (data) => {
    memberMutation.mutate({
      method: "edit",
      slug: member.slug,
      isImageVerified: data.showImage,
      isImageHidden: !data.showImage,
      ...data,
    });
  };

  const onDelete = (slug) => {
    memberMutation.mutate({
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
            errors={errors.role}
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
};

export default MemberEditDialog;
