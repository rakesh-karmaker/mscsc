import FileInput from "@/components/UI/FileInput/FileInput";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";
import { useForm } from "react-hook-form";

import "./ActivityForm.css";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { addActivity } from "@/services/PostService";
import toast, { Toaster } from "react-hot-toast";

const ActivityForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm();

  const tags = ["Event", "Workshop", "Article", "Achievement"];

  const onSubmit = async (data) => {
    const res = await addActivity(data);
    if (res.status === 200) {
      toast.success("Activity added successfully");
    } else {
      toast.error("Failed to add activity");
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
          Activity Cover Image:
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

        <SubmitBtn isSubmitting={isSubmitting} pendingText="Adding">
          Add Activity
        </SubmitBtn>
        <Toaster position="top-right" />
      </form>
    </div>
  );
};

export default ActivityForm;
