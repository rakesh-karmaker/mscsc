import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import {
  addActivity,
  deleteActivity,
  editActivity,
} from "@/lib/api/activities";
import { tags } from "@/services/data/data";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Activity, ActivityPreview } from "@/types/activity-types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  activitySchema,
  type ActivitySchemaType,
} from "@/lib/validation/activity-schema";
import type { AxiosError } from "axios";
import FormHeading from "@/components/ui/form-heading/from-heading";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import FileInput from "@/components/ui/file-input";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import FormSubmitBtn from "@/components/ui/form-submit-btn";
import DeleteWarning from "@/components/ui/delete-warning";
import ImageDropper from "@/components/ui/image-dropper/image-dropper";

import "./activity-form.css";

type ActivityFormProps = {
  defaultValues?: Activity;
  method: "add" | "edit" | "delete";
  setSelectedActivity?: Dispatch<SetStateAction<ActivityPreview | null>>;
};

export default function ActivityForm(props: ActivityFormProps) {
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
    setError,
  } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues,
  });

  const activityMutation = useMutation({
    mutationFn: (
      data: ActivitySchemaType & {
        method: "add" | "edit" | "delete";
        slug?: string;
      }
    ) => {
      const { method, ...rest } = data;
      if (method == "add") {
        const { slug, ...activityData } = rest;
        if (
          !activityData.activityImage ||
          activityData.activityImage.length === 0
        ) {
          setError("root", {
            message: "Activity cover image is required.",
          });
          toast.error("Activity cover image is required.");
          return Promise.reject("Activity cover image is required.");
        }

        return addActivity(activityData);
      } else if (method == "delete") {
        return deleteActivity(rest.slug || "");
      } else if (method == "edit") {
        rest.slug = props.defaultValues?.slug || "";
        return editActivity(rest as ActivitySchemaType & { slug: string });
      }

      return Promise.reject("Invalid method");
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      if (props?.method == "edit") {
        if (props?.setSelectedActivity) {
          props?.setSelectedActivity(null);
        }
      } else {
        navigate("/admin/activities");
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err?.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = async (data: ActivitySchemaType) => {
    activityMutation.mutate({
      method: props?.method,
      slug: props?.defaultValues?.slug || "",
      ...data,
    });
  };

  const onDelete = (slug: string) => {
    activityMutation.mutate({
      title: "",
      date: dayjs(),
      tag: "",
      summary: "",
      content: "",
      method: "delete",
      slug: slug,
    });
  };

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <FormHeading style={{ fontSize: "42px", lineHeight: "52px" }}>
          {props?.defaultValues ? "Edit Activity" : "Add Activity"}
        </FormHeading>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="activity-form max-w-[min(var(--container-4xl),var(--max-elements-width))] mx-auto!"
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              label="Activity Title"
            />

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  value={field.value || defaultValues.date}
                  onChange={(date) => field.onChange(date)}
                  label="Activity Date"
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
            error={!!errors.summary}
            helperText={errors.summary?.message}
            fullWidth
            rows={3}
          />

          <FileInput
            register={register}
            name="activityImage"
            errors={errors}
            labelText={
              props?.defaultValues
                ? "Change Activity Cover Image"
                : "Activity Cover Image:"
            }
          >
            Add Photo
          </FileInput>

          <FormControl fullWidth error={!!errors.tag}>
            <InputLabel id={"select-activity-type"}>Activity Type</InputLabel>
            <Controller
              name={"tag"}
              control={control}
              render={({ field }) => (
                <Select
                  labelId={"select-activity-type"}
                  id={"select-id-activity-type"}
                  label={"Activity Type"}
                  {...field}
                >
                  {tags.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.tag?.message && (
              <p style={{ color: "red" }}>{String(errors.tag?.message)}</p>
            )}
          </FormControl>

          <ImageDropper
            register={register}
            name="gallery"
            title={"Add Gallery"}
          />

          <RichTextEditor
            register={register}
            content={props?.defaultValues?.content || ""}
          />

          <div className="w-full flex flex-col gap-2">
            <div className="combined-btns">
              <FormSubmitBtn
                isLoading={activityMutation.isPending}
                pendingText={props?.defaultValues ? "Updating" : "Adding"}
              >
                {props?.defaultValues ? "Update" : "Add"} Activity
              </FormSubmitBtn>

              {props?.defaultValues && (
                <button
                  className="danger-button primary-button"
                  aria-label="Delete this data"
                  type="button"
                  onClick={(_) => {
                    setOpen(true);
                  }}
                >
                  Delete Activity
                </button>
              )}
            </div>
            {errors.root?.message && (
              <p style={{ color: "red" }}>{String(errors.root?.message)}</p>
            )}
          </div>
        </form>
      </div>

      <DeleteWarning
        slug={props?.defaultValues?.slug || ""}
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
}
