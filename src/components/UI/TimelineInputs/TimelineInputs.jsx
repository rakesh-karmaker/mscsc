import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { useForm } from "react-hook-form";

import InputText from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";

// const TimelineInputs = ({ register, errors, control }) => {
//   const [activeIndex, setActiveIndex] = useState(null);

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "timeline",
//   });
//   const [timelineLength, setTimelineLength] = useState(fields.length);

//   const handleAddClick = () => {
//     append({
//       title: "",
//       date: "",
//       tag: "",
//       description: "",
//       link: "",
//     });
//     setActiveIndex(fields.length);
//     setTimelineLength(fields.length + 1);
//   };

//   const handleRemoveClick = (index) => {
//     remove(index);
//     setTimelineLength(fields.length - 1);
//     setActiveIndex(null);
//   };

//   const tags = ["Certificate", "Article", "Project"];
//   return (
//     <div
//       className="timeline-inputs-container"
//       style={{ marginTop: fields.length > 0 ? "2rem" : "0" }}
//     >
//       {fields.map((field, index) => (
//         <div key={field.id}>
//           <div className="timeline-actions">
//             <button
//               type="button"
//               onClick={() => setActiveIndex(index)}
//               className={index === activeIndex ? "active" : ""}
//             >
//               Timeline Event {index + 1}
//             </button>
//             <button
//               type="button"
//               onClick={() => handleRemoveClick(index)}
//               className="remove"
//             >
//               Remove Event
//             </button>
//           </div>
//           <div
//             className={`timeline-input-fields ${
//               index === activeIndex ? "active" : ""
//             }`}
//           >
//             <div className="combined-inputs">
//               <InputText
//                 register={register(`timeline.${index}.title`)}
//                 errors={errors[`timeline.${index}.title`]}
//                 id={`timeline.${index}.title`}
//               >
//                 Event Title
//               </InputText>

//               <InputText
//                 register={register(`timeline.${index}.date`)}
//                 errors={errors[`timeline.${index}.date`]}
//                 type="date"
//                 id={`timeline.${index}.date`}
//               >
//                 Event Date
//               </InputText>
//             </div>

//             <RadioList
//               register={register(`timeline.${index}.tag`)}
//               dataList={tags}
//               errors={errors[`timeline.${index}.tag`]}
//             >
//               Event Tag:
//             </RadioList>

//             <InputText
//               register={register(`timeline.${index}.description`)}
//               errors={errors[`timeline.${index}.description`]}
//               id={`timeline.${index}.description`}
//             >
//               Event Description
//             </InputText>

//             <InputText
//               register={register(`timeline.${index}.link`)}
//               errors={errors[`timeline.${index}.link`]}
//               id={`timeline.${index}.link`}
//             >
//               Event Link
//             </InputText>
//           </div>
//         </div>
//       ))}
//       {timelineLength < 3 ? (
//         <button type="button" onClick={handleAddClick} className="add">
//           Add Event to Timeline
//         </button>
//       ) : (
//         <p className="secondary-text">Maximum 3 events</p>
//       )}
//     </div>
//   );
// };

const Test = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      timeline: [
        {
          title: "",
          date: "",
          tag: "",
          description: "",
          link: "",
        },
      ],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "timeline",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => {
        <div key={index}>
          <input {...register(`timeline.${index}.title`)} />
          <input {...register(`timeline.${index}.date`)} />
          <input {...register(`timeline.${index}.tag`)} />
          <input {...register(`timeline.${index}.description`)} />
          <input {...register(`timeline.${index}.link`)} />
        </div>;
      })}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Test;
