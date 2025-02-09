import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import InputText from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";

import "./TimelineInputs.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";
import toast from "react-hot-toast";
import useErrorNavigator from "@/hooks/useErrorNavigator";

const TimelineInputs = ({ timeline, user, setIsEditing }) => {
  const queryClient = useQueryClient();
  const [activeIndex, setActiveIndex] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      timeline: timeline,
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
    timelineMutation.mutate(data);
  };

  const tags = ["Certificate", "Competition", "Project"];
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
            <div className="combined-inputs">
              <InputText
                setValue={setValue}
                trigger={trigger}
                register={register}
                errors={errors?.timeline?.[index]?.title}
                id={`timeline.${index}.title`}
              >
                Event Title
              </InputText>

              <InputText
                setValue={setValue}
                trigger={trigger}
                register={register}
                errors={errors?.timeline?.[index]?.date}
                type="date"
                id={`timeline.${index}.date`}
              >
                Event Date
              </InputText>
            </div>

            <RadioList
              register={register(`timeline.${index}.tag`)}
              dataList={tags}
              errors={errors?.timeline?.[index]?.tag}
              id={`timeline.${index}.tag`}
            >
              Event Tag:
            </RadioList>

            <InputText
              setValue={setValue}
              trigger={trigger}
              register={register}
              errors={errors?.timeline?.[index]?.description}
              id={`timeline.${index}.description`}
            >
              Event Description
            </InputText>

            <InputText
              setValue={setValue}
              trigger={trigger}
              register={register}
              errors={errors?.timeline?.[index]?.link}
              id={`timeline.${index}.link`}
            >
              Event Link
            </InputText>
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
