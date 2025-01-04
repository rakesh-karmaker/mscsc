import FileInput from "@/components/UI/FileInput/FileInput";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";
import { useForm } from "react-hook-form";

import "./ActivityForm.css";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { addActivity } from "@/services/PostService";
import toast, { Toaster } from "react-hot-toast";
import { editActivity } from "@/services/PutService";
import { useQueryClient } from "@tanstack/react-query";
import DeleteBtn from "@/components/UI/DeleteBtn/DeleteBtn";

const ActivityForm = (props) => {
  const queryClient = useQueryClient();
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
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: defaultValues,
  });

  const tags = ["Event", "Workshop", "Article", "Achievement"];

  const onSubmit = async (data) => {
    let res = null;
    if (props?.defaultValues) {
      res = await editActivity({ ...data, _id: props.defaultValues._id });
      if (res.status === 200) {
        toast.success("Activity edited successfully");
        queryClient.invalidateQueries("activities");
        props?.setSelectedActivity(null);
      } else {
        toast.error("Failed to edit activity");
      }
    } else {
      res = await addActivity(data);
      if (res.status === 200) {
        toast.success("Activity added successfully");
        queryClient.invalidateQueries("activities");
        props?.setCreateActivity(false);
      } else {
        toast.error("Failed to add activity");
      }
    }
  };

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
            isSubmitting={isSubmitting}
            pendingText={props?.defaultValues ? "Editing" : "Adding"}
          >
            {props?.defaultValues ? "Edit" : "Add"} Activity
          </SubmitBtn>
          {props?.defaultValues && (
            <DeleteBtn
              id={props.defaultValues._id}
              deleteFunc={props.deleteActivity}
              btnText="Delete Activity"
            >
              Are you sure you want to delete this activity?
            </DeleteBtn>
          )}
        </div>
        <Toaster position="top-right" />
      </form>
    </div>
  );
};

export default ActivityForm;
