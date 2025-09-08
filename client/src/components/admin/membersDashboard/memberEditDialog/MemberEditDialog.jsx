import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import "./MemberEditDialog.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import SelectInput from "@/components/UI/SelectInput";
import { editUser } from "@/lib/api/auth";
import { deleteMember } from "@/lib/api/member";

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
    <div className="member-edit-btn-container" style={{ cursor: "initial" }}>
      {isOpen === true && (
        <div
          className={`dialog-container ${isOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <dialog className="edit-dialog" open>
            <div>
              <div className="edit-dialog-title">
                <h2>Edit Member</h2>
                <FontAwesomeIcon
                  icon="fa-solid fa-x"
                  className="close"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                />
              </div>
            </div>
            <EditForm
              member={member}
              setIsOpen={setIsOpen}
              deleteMember={deleteMemberFunc}
            />
          </dialog>
        </div>
      )}

      <button
        type="button"
        className={`primary-button ${member?.new ? "new" : ""}`}
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
  );
};

const EditForm = ({ member, setIsOpen }) => {
  const queryClient = useQueryClient();
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

  const deleteMemberFunc = (slug) => {
    memberMutation.mutate({
      slug: slug,
    });
  };

  return (
    <form onSubmit={handleSubmit(editMemberFunc)} className="member-edit-form">
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

      <FormControlLabel
        control={
          <Checkbox
            defaultChecked={member?.isImageVerified ? true : false}
            {...register("showImage")}
          />
        }
        label={<span>Show image</span>}
      />

      <div className="edit-dialog-actions">
        <button
          type="submit"
          className="primary-button"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Save
        </button>

        <button
          type="button"
          className="danger-button primary-button"
          onClick={(e) => {
            e.stopPropagation();
            deleteMemberFunc(member.slug);
          }}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default MemberEditDialog;
