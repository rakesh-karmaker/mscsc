import FileInput from "@/components/UI/FileInput/FileInput";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";
import { useForm } from "react-hook-form";

import "./ActivityForm.css";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { addActivity } from "@/services/PostService";
import toast from "react-hot-toast";
import { editActivity } from "@/services/PutService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";
import { deleteActivity } from "@/services/DeleteService";
import useLoadingToast from "@/hooks/useLoadingToast";
import { useState } from "react";

const ActivityForm = (props) => {
  const queryClient = useQueryClient();
  const [loadingText, setLoadingText] = useState(
    props?.defaultValues ? "Editing Activity..." : "Adding Activity..."
  );
  const defaultValues = props?.defaultValues
    ? {
        title: props.defaultValues.title,
        description: props.defaultValues.description,
        date: new Date(props.defaultValues.date).toISOString().split("T")[0],
        link: props.defaultValues.link,
        tag: props.defaultValues.tag,
      }
    : {};

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  const tags = ["Event", "Workshop", "Article", "Achievement"];

  const activityMutation = useMutation({
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "add") {
        return addActivity(rest);
      } else if (method == "delete") {
        return deleteActivity(rest._id);
      } else if (method == "edit") {
        rest._id = props.defaultValues._id;
        return editActivity(rest);
      }
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      props.setSelectedActivity(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries("activities");
    },
  });

  const onSubmit = async (data) => {
    activityMutation.mutate({
      method: props?.defaultValues ? "edit" : "add",
      ...data,
    });
  };

  const onDelete = (_id) => {
    setLoadingText("Deleting Activity...");
    activityMutation.mutate({
      method: "delete",
      _id: _id,
    });
  };

  useLoadingToast(activityMutation.isPending, loadingText);

  return (
    <div>
      <FormHeading style={{ fontSize: "42px", lineHeight: "52px" }}>
        Add Activity
      </FormHeading>
      <form onSubmit={handleSubmit(onSubmit)} className="activity-form">
        <div className="combined-inputs">
          <InputText
            register={register}
            errors={errors.title}
            id="title"
            setValue={setValue}
            trigger={trigger}
          >
            Activity Name
          </InputText>

          <InputText
            register={register}
            errors={errors.date}
            id="date"
            setValue={setValue}
            trigger={trigger}
            type="date"
          >
            Date
          </InputText>
        </div>

        <RadioList
          register={register("tag")}
          errors={errors.type}
          dataList={tags}
        >
          Activity Type:
        </RadioList>

        <FileInput register={register("activityImage")} errors={errors.image}>
          {props?.defaultValues
            ? "Change Activity Cover Image"
            : "Activity Cover Image:"}
        </FileInput>

        <TextArea
          register={register("description")}
          errors={errors.description}
        >
          Description
        </TextArea>

        <InputText
          register={register}
          errors={errors.link}
          id="link"
          setValue={setValue}
          trigger={trigger}
        >
          Activity Facebook Post Link
        </InputText>

        <div className="combined-btns">
          <SubmitBtn
            isLoading={activityMutation.isPending}
            pendingText={props?.defaultValues ? "Editing" : "Adding"}
          >
            {props?.defaultValues ? "Edit" : "Add"} Activity
          </SubmitBtn>
          {props?.defaultValues && (
            <DeleteBtn
              id={props.defaultValues._id}
              deleteFunc={onDelete}
              btnText="Delete Activity"
            >
              Are you sure you want to delete this activity?
            </DeleteBtn>
          )}
        </div>
      </form>
    </div>
  );
};

export default ActivityForm;
