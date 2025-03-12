import FileInput from "@/components/UI/FileInput/FileInput";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import { Controller, useForm } from "react-hook-form";

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
import { Stack, TextField } from "@mui/material";
import DateTimePicker from "@/components/UI/dateTimePicker/DateTimePicker";
import SelectInput from "@/components/UI/SelectInput";
import dayjs from "dayjs";
import tags from "@/services/data/tags";

const ActivityForm = (props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const defaultValues = props?.defaultValues
    ? {
        title: props.defaultValues.title,
        summary: props.defaultValues.summary,
        date: dayjs(props.defaultValues.date),
        tag: props.defaultValues.tag,
        content: props.defaultValues.content,
      }
    : {
        tag: "",
      };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

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
    data.date = data.date.toISOString();
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
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            {...register("title")}
            error={errors.title ? true : false}
            helperText={errors.title?.message}
            label="Activity Title"
          />

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={field.value || defaultValues.deadline}
                onChange={(date) => field.onChange(date)}
                error={errors.deadline}
                helperText={errors.deadline?.message}
              />
            )}
          />
        </Stack>

        <TextField
          {...register("summary")}
          type="text"
          label="Activity Summary"
          variant="outlined"
          multiline
          error={errors.summary}
          helperText={errors.summary?.message}
          fullWidth
          rows={3}
        />

        <FileInput register={register("activityImage")} errors={errors.image}>
          {props?.defaultValues
            ? "Change Activity Cover Image"
            : "Activity Cover Image:"}
        </FileInput>

        <SelectInput
          control={control}
          name={"tag"}
          errors={errors.tag}
          dataList={tags}
        >
          Activity Type
        </SelectInput>

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
