import InputText from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "./MemberEditDialog.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { editUser } from "@/services/PutService";
import { deleteMember } from "@/services/DeleteService";

const MemberEditDialog = ({ member, deleteMember }) => {
  const queryClient = useQueryClient();
  const editDialog = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const memberNewMutation = useMutation({
    mutationFn: () => editUser({ _id: member?._id, new: false }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return (
    <div className="member-edit-btn-container" style={{ cursor: "initial" }}>
      <div
        className={`dialog-container ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <dialog className="edit-dialog" ref={editDialog}>
          <div>
            <div className="edit-dialog-title">
              <h2>Edit Member</h2>
              <FontAwesomeIcon
                icon="fa-solid fa-x"
                className="close"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  editDialog.current.close();
                }}
              />
            </div>
          </div>
          <EditForm
            member={member}
            setIsOpen={setIsOpen}
            editDialog={editDialog}
            deleteMember={deleteMember}
          />
        </dialog>
      </div>

      <button
        type="button"
        className={`primary-button ${member?.new ? "new" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
          if (member?.new) {
            memberNewMutation.mutate();
          }
          editDialog.current.showModal();
        }}
      >
        Edit Member
      </button>
    </div>
  );
};

const EditForm = ({ member, setIsOpen, editDialog }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      position: member?.position,
      role: member?.role,
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
      setIsOpen(false);
      editDialog.current.close();
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const editMemberFunc = (data) => {
    memberMutation.mutate({
      method: "edit",
      _id: member._id,
      ...data,
    });
  };

  const deleteMemberFunc = (id) => {
    memberMutation.mutate({
      _id: id,
    });
  };

  return (
    <form onSubmit={handleSubmit(editMemberFunc)} className="member-edit-form">
      <InputText
        register={register}
        errors={errors.position}
        id="position"
        setValue={setValue}
        trigger={trigger}
      >
        Change Position
      </InputText>

      <RadioList
        register={register("role")}
        errors={errors.role}
        dataList={["member", "admin"]}
      >
        Change Role
      </RadioList>
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
            deleteMemberFunc(member._id);
          }}
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default MemberEditDialog;
