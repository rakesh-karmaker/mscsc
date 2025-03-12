import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import "./TimelineInputs.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";
import toast from "react-hot-toast";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { Stack, TextField } from "@mui/material";
import DateTimePicker from "../dateTimePicker/DateTimePicker";
import dayjs from "dayjs";
import SelectInput from "../SelectInput";

const TimelineInputs = ({ timeline, user, setIsEditing }) => {
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(null);

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
      date: "",
      tag: "",
      description: "",
      link: "",
    });
    setActiveIndex(fields.length);
    setTimelineLength(fields.length + 1);
  };

  const handleRemoveClick = (index) => {
    remove(index);
    setTimelineLength(fields.length - 1);
    setActiveIndex(null);
  };

  const timelineMutation = useMutation({
    mutationFn: (data) => {
      data.slug = user.slug;
      return editUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      toast.success("Edited Successfully!");
      window.scrollTo(0, 0);
      setIsEditing(false);
    },
    onError: (err) => {
      useErrorNavigator(true, err);
    },
  });

  const onSubmit = async (data) => {
    // console.log(data);
    data.timeline = data.timeline.map((item) => {
      const date = dayjs(item.date);
      return {
        title: item.title,
        date: date.isValid() ? date.toISOString() : "", // Check if date is valid before converting to ISO string
        tag: item.tag,
        description: item.description,
        link: item.link,
      };
    });
    timelineMutation.mutate(data);
  };

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
                  {...register(`timeline.${index}.title`)}
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
                      error={errors?.timeline?.[index]?.date}
                      helperText={errors?.timeline?.[index]?.date?.message}
                      label="Event Date"
                    />
                  )}
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <SelectInput
                  control={control}
                  name={`timeline.${index}.tag`}
                  errors={errors?.timeline?.[index]?.tag}
                  dataList={tags}
                >
                  Event Tag
                </SelectInput>

                <TextField
                  {...register(`timeline.${index}.link`)}
                  id={`timeline.${index}.link`}
                  label="Event Link"
                  variant="outlined"
                  error={!!errors?.timeline?.[index]?.link}
                  helperText={errors?.timeline?.[index]?.link?.message}
                  fullWidth
                />
              </Stack>

              <TextField
                {...register(`timeline.${index}.description`)}
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
};

export default TimelineInputs;
