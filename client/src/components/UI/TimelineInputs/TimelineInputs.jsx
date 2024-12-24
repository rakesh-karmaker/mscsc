import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import InputText from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";

import "./TimelineInputs.css";
import editProfileToast from "@/components/profile-components/editProfileToast";

const TimelineInputs = ({ timeline }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
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

  const onSubmit = async (data) => {
    editProfileToast(data, setError);
  };

  const tags = ["Certificate", "Article", "Project"];
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
              Timeline Event {index + 1}
            </button>
            <button
              type="button"
              onClick={() => handleRemoveClick(index)}
              className="remove"
            >
              Remove Event
            </button>
          </div>
          <div
            className={`timeline-input-fields ${
              index === activeIndex ? "active" : ""
            }`}
          >
            <div className="combined-inputs">
              <InputText
                register={register(`timeline.${index}.title`)}
                errors={errors[`timeline.${index}.title`]}
                id={`timeline.${index}.title`}
              >
                Event Title
              </InputText>

              <InputText
                register={register(`timeline.${index}.date`)}
                errors={errors[`timeline.${index}.date`]}
                type="date"
                id={`timeline.${index}.date`}
              >
                Event Date
              </InputText>
            </div>

            <RadioList
              register={register(`timeline.${index}.tag`)}
              dataList={tags}
              errors={errors[`timeline.${index}.tag`]}
              id={`timeline.${index}.tag`}
            >
              Event Tag:
            </RadioList>

            <InputText
              register={register(`timeline.${index}.description`)}
              errors={errors[`timeline.${index}.description`]}
              id={`timeline.${index}.description`}
            >
              Event Description
            </InputText>

            <InputText
              register={register(`timeline.${index}.link`)}
              errors={errors[`timeline.${index}.link`]}
              id={`timeline.${index}.link`}
            >
              Event Link
            </InputText>
          </div>
        </div>
      ))}
      {timelineLength < 3 ? (
        <button type="button" onClick={handleAddClick} className="add">
          Add Event to Timeline
        </button>
      ) : (
        <p className="secondary-text">Maximum 3 events</p>
      )}
      <button
        type="submit"
        className="timeline-submit"
        disabled={fields.length === 0 || isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Timeline"}
      </button>
    </form>
  );
};

export default TimelineInputs;
