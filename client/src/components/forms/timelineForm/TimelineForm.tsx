import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { editTimeline } from "@/lib/api/member";
import type { User } from "@/types/userTypes";
import dayjs from "dayjs";
import { type TimelineSchemaType } from "@/lib/validation/timelineSchema";
import { DateTimePicker } from "@/components/ui/DateTimePicker";

import "./timelineForm.css";

export default function TimelineForm({
  timeline,
  user,
  setIsEditing,
}: {
  timeline: User["timeline"];
  user: User;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}): ReactNode {
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      timeline: timeline
        ? timeline.map((item) => {
            return {
              title: item.title,
              date: dayjs(item.date),
              tag: item.tag || "",
              description: item.description,
              link: item.link,
            };
          })
        : [],
    } as {
      timeline: {
        title: string;
        date: any;
        tag: string;
        description: string;
        link: string;
      }[];
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeline",
  });
  const [timelineLength, setTimelineLength] = useState(fields.length);

  const handleAddClick = () => {
    append({
      title: "",
      date: dayjs(),
      tag: "",
      description: "",
      link: "",
    });
    setActiveIndex(fields.length);
    setTimelineLength(fields.length + 1);
  };

  const handleRemoveClick = (index: number) => {
    remove(index);
    setTimelineLength(fields.length - 1);
    setActiveIndex(null);
  };

  const timelineMutation = useMutation({
    mutationFn: (data: { timeline: TimelineSchemaType[]; slug: string }) => {
      data.slug = user.slug;
      return editTimeline(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Edited Successfully!");
      window.scrollTo(0, 0);
      setIsEditing(false);
    },
    onError: (err) => {
      useErrorNavigator(true, err);
    },
  });

  function onSubmit(data: { timeline: TimelineSchemaType[] }) {
    if (data.timeline.length === 0) {
      toast.error("Add at least one timeline event or cancel");
      return;
    }

    data.timeline = data.timeline.map((item) => {
      const date = dayjs(item.date);
      return {
        title: item.title,
        date: date.isValid() ? date.toDate() : new Date(), // Keep as Date object
        tag: item.tag,
        description: item.description,
        link: item.link,
      };
    });
    timelineMutation.mutate({ timeline: data.timeline, slug: user.slug });
  }

  const tags = [
    {
      value: "Certificate",
      label: "Certificate",
    },
    {
      value: "Competition",
      label: "Competition",
    },
    {
      value: "Project",
      label: "Project",
    },
  ];
  const maxTimelineLimit = 6;
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="timeline-inputs-container"
      style={{ marginTop: fields.length > 0 ? "2rem" : "0" }}
    >
      <p className="timeline-header">Timeline Edit</p>
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="timeline-actions">
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className={index === activeIndex ? "active" : ""}
            >
              {fields[index]?.title
                ? fields[index].title.length > 25
                  ? fields[index].title.slice(0, 25) + "..."
                  : fields[index].title
                : `Event ${index + 1}`}
            </button>
            {timelineLength > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveClick(index)}
                className="remove"
              >
                Remove Event
              </button>
            )}
          </div>
          <div
            className={`timeline-input-fields ${
              index === activeIndex ? "active" : ""
            }`}
          >
            <div className="timeline-input-inner">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ pt: 1 }}
              >
                <TextField
                  {...register(`timeline.${index}.title`, { required: true })}
                  id={`timeline.${index}.title`}
                  label="Event Title"
                  variant="outlined"
                  error={!!errors?.timeline?.[index]?.title}
                  helperText={errors?.timeline?.[index]?.title?.message}
                  fullWidth
                />
                <Controller
                  name={`timeline.${index}.date`}
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      {...field}
                      value={field.value || dayjs()} // Set default value to current date
                      onChange={(date) => field.onChange(date)}
                      label="Event Date"
                    />
                  )}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth error={!!errors?.timeline?.[index]?.tag}>
                  <InputLabel id={"select-label" + `timeline.${index}.tag`}>
                    Event tag
                  </InputLabel>
                  <Controller
                    name={`timeline.${index}.tag`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        labelId={"select-label" + `timeline.${index}.tag`}
                        id={"select" + `timeline.${index}.tag`}
                        label="Branch"
                        fullWidth
                        {...field}
                        error={!!errors.timeline?.[index]?.tag}
                        required={true}
                      >
                        {tags.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors?.timeline?.[index]?.tag && (
                    <p style={{ color: "red" }}>
                      {errors?.timeline?.[index]?.tag.message}
                    </p>
                  )}
                </FormControl>

                <TextField
                  {...register(`timeline.${index}.link`, { required: false })}
                  id={`timeline.${index}.link`}
                  label="Event Link"
                  variant="outlined"
                  error={!!errors?.timeline?.[index]?.link}
                  helperText={errors?.timeline?.[index]?.link?.message}
                  fullWidth
                />
              </Stack>

              <TextField
                {...register(`timeline.${index}.description`, {
                  required: true,
                })}
                id={`timeline.${index}.description`}
                label="Event Description"
                variant="outlined"
                multiline
                rows={4}
                error={!!errors?.timeline?.[index]?.description}
                helperText={errors?.timeline?.[index]?.description?.message}
                fullWidth
              />
            </div>
          </div>
        </div>
      ))}
      {timelineLength < maxTimelineLimit ? (
        <button type="button" onClick={handleAddClick} className="add">
          Add Event to Timeline
        </button>
      ) : (
        <p className="secondary-text">Maximum {maxTimelineLimit} events</p>
      )}
      <button
        type="submit"
        className="timeline-submit"
        disabled={fields.length === 0 || timelineMutation.isPending}
      >
        {timelineMutation.isPending ? "Submitting..." : "Submit Timeline"}
      </button>
    </form>
  );
}
