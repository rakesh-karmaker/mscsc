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
import ImageDropper from "@/components/UI/ImageDropper/ImageDropper";
import Editor from "@/components/UI/Editor/Editor";
import { useNavigate } from "react-router-dom";

const ActivityForm = (props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const defaultValues = props?.defaultValues
    ? {
        title: props.defaultValues.title,
        summary: props.defaultValues.summary,
        date: new Date(props.defaultValues.date).toISOString().split("T")[0],
        tag: props.defaultValues.tag,
        content: props.defaultValues.content,
      }
    : {};

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const tags = ["Event", "Workshop", "Article", "Achievement"];

  const activityMutation = useMutation({
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "add") {
        return addActivity(rest);
      } else if (method == "delete") {
        return deleteActivity(rest.slug);
      } else if (method == "edit") {
        rest.slug = props.defaultValues.slug;
        return editActivity(rest);
      }
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries("activities");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
    onSettled: () => {
      if (props?.method == "edit") {
        props?.setSelectedActivity(null);
      } else {
        navigate("/admin/activities");
      }
    },
  });

  const onSubmit = async (data) => {
    activityMutation.mutate({
      method: props?.method,
      ...data,
    });
  };

  const onDelete = (slug) => {
    activityMutation.mutate({
      method: "delete",
      slug: slug,
    });
  };

  return (
    <div>
      <FormHeading style={{ fontSize: "42px", lineHeight: "52px" }}>
        {props?.defaultValues ? "Edit Activity" : "Add Activity"}
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
            Activity Title
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

        <TextArea register={register("summary")} errors={errors.summary}>
          Activity Summary
        </TextArea>

        <FileInput register={register("activityImage")} errors={errors.image}>
          {props?.defaultValues
            ? "Change Activity Cover Image"
            : "Activity Cover Image:"}
        </FileInput>

        <RadioList
          register={register("tag")}
          errors={errors.type}
          dataList={tags}
        >
          Activity Type:
        </RadioList>

        <ImageDropper register={register("gallery")} title={"Add Gallery"} />

        <Editor
          register={register("content")}
          content={props?.defaultValues?.content}
        />

        <div className="combined-btns">
          <SubmitBtn
            isLoading={activityMutation.isPending}
            pendingText={props?.defaultValues ? "Updating" : "Adding"}
          >
            {props?.defaultValues ? "Update" : "Add"} Activity
          </SubmitBtn>
          {props?.defaultValues && (
            <DeleteBtn
              id={props.defaultValues.slug}
              deleteFunc={onDelete}
              btnText="Delete Activity"
              title="Delete Activity"
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
