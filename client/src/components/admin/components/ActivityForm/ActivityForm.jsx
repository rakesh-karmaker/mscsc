import FileInput from "@/components/UI/FileInput/FileInput";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import { Controller, useForm } from "react-hook-form";
import "./ActivityForm.css";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteWarning } from "@/components/UI/DeleteWarning";
import ImageDropper from "@/components/UI/ImageDropper/ImageDropper";
import Editor from "@/components/UI/Editor/Editor";
import { useNavigate } from "react-router-dom";
import { Stack, TextField } from "@mui/material";
import DateTimePicker from "@/components/UI/dateTimePicker/DateTimePicker";
import SelectInput from "@/components/UI/SelectInput";
import dayjs from "dayjs";
import {
  addActivity,
  deleteActivity,
  editActivity,
} from "@/lib/api/activities";
import { tags } from "@/services/data/data";
import { useState } from "react";

const ActivityForm = (props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

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
    <>
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
              <button
                className="danger-button primary-button"
                aria-label="Delete this data"
                type="button"
                onClick={(e) => {
                  setOpen(true);
                }}
              >
                Delete Activity
              </button>
            )}
          </div>
        </form>
      </div>

      <DeleteWarning
        slug={props?.defaultValues?.slug}
        deleteFunc={onDelete}
        open={open}
        setOpen={setOpen}
        title="Delete Activity"
      >
        This will permanently delete this activity{" "}
        <span className="font-semibold">{props?.defaultValues?.title}</span>{" "}
        from the activity's list and remove all of its data from the server. All
        of its images, links, and other data will be permanently lost.
      </DeleteWarning>
    </>
  );
};

export default ActivityForm;
