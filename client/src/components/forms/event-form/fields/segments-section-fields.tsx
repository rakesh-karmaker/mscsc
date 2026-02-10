import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { Stack, TextField, Tooltip } from "@mui/material";
import { FaGlobeAsia } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { icons } from "@/services/data/icons-data";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import SelectIconField from "@/components/ui/select-icon-field";

type SegmentsSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function SegmentsSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: SegmentsSectionFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "segmentsData",
  });

  function handleAppend() {
    append({
      title: "",
      details: "",
      locationType: "onsite",
      teamType: "solo",
      icon: "bulb",
      summary: "",
      rules: "",
    });
  }

  function handleRemove(index: number) {
    remove(index);
  }

  useEffect(() => {
    if (fields.length === 0) {
      handleAppend();
    }
  }, [fields, append]);

  return (
    <FormLayout
      title={"Segments Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The segments section is a part of the event page that typically
          contains various segments or parts related to the event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-10">
        {fields.map((field, index) => (
          <FormLayout
            key={field.id}
            title={`Segment ${index + 1}`}
            description={
              <p className="w-full min-w-[30ch] h-full">
                Details for segment {index + 1}.
              </p>
            }
            textSize="lg"
            fontWeight="medium"
            cancelButton={
              <Tooltip title="Remove Segment" placement="top" arrow>
                <span>
                  <button
                    type="button"
                    className="primary-button before:bg-red-500! w-fit! min-w-fit! px-3! py-1.5! text-base! font-normal! h-fit! transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleRemove(index)}
                    disabled={fields.length <= 1}
                  >
                    Remove
                  </button>
                </span>
              </Tooltip>
            }
          >
            <div className="w-full flex flex-col gap-4">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <SelectIconField
                  id={`segments-location-type-${index}`}
                  name={`segmentsData.${index}.locationType`}
                  icons={{
                    onsite: <IoLocationOutline />,
                    online: <FaGlobeAsia />,
                  }}
                  control={control}
                  hasErrors={Boolean(
                    errors?.segmentsData?.[index]?.locationType,
                  )}
                  errorMessage={
                    errors.segmentsData?.[index]?.locationType
                      ?.message as string
                  }
                  defaultValue="onsite"
                >
                  Location Type
                </SelectIconField>

                <SelectIconField
                  id={`segments-team-type-${index}`}
                  name={`segmentsData.${index}.teamType`}
                  icons={{
                    solo: <FaGlobeAsia />,
                    team: <IoLocationOutline />,
                  }}
                  control={control}
                  hasErrors={Boolean(errors?.segmentsData?.[index]?.teamType)}
                  errorMessage={
                    errors.segmentsData?.[index]?.teamType?.message as string
                  }
                  defaultValue="solo"
                >
                  Team Type
                </SelectIconField>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  {...register(`segmentsData.${index}.title`, {
                    required: isSectionSelected
                      ? "Segment title is required"
                      : false,
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters",
                    },
                  })}
                  label="Segment Title"
                  error={Boolean(
                    errors.segmentsData &&
                    errors.segmentsData[index] &&
                    errors.segmentsData[index].title,
                  )}
                  helperText={
                    errors.segmentsData &&
                    errors.segmentsData[index] &&
                    errors.segmentsData[index].title &&
                    (errors.segmentsData[index].title.message as string)
                  }
                />

                <SelectIconField
                  id={`segments-icon-${index}`}
                  name={`segmentsData.${index}.icon`}
                  icons={icons}
                  control={control}
                  hasErrors={Boolean(errors?.segmentsData?.[index]?.icon)}
                  errorMessage={
                    errors.segmentsData?.[index]?.icon?.message as string
                  }
                  defaultValue="bulb"
                >
                  Segment Icon
                </SelectIconField>
              </Stack>

              <TextField
                fullWidth
                variant="outlined"
                {...register(`segmentsData.${index}.summary`, {
                  required: isSectionSelected
                    ? "Segment summary is required"
                    : false,
                })}
                label="Segment Summary"
                placeholder="A brief summary of the segment."
                multiline
                minRows={4}
                error={Boolean(
                  errors.segmentsData &&
                  errors.segmentsData[index] &&
                  errors.segmentsData[index].summary,
                )}
                helperText={
                  errors.segmentsData &&
                  errors.segmentsData[index] &&
                  errors.segmentsData[index].summary &&
                  (errors.segmentsData[index].summary.message as string)
                }
              />

              <FormLayout
                title="Details"
                textSize="lg"
                fontWeight="medium"
                description={
                  <p className="w-full min-w-[30ch] h-full">
                    Provide detailed information about this segment of the
                    event.
                  </p>
                }
              >
                <RichTextEditor
                  content=""
                  label={`segmentsData.${index}.details`}
                  register={register}
                />
              </FormLayout>

              <FormLayout
                title="Rules and Guidelines"
                textSize="lg"
                fontWeight="medium"
                description={
                  <p className="w-full min-w-[30ch] h-full">
                    Specify any rules or guidelines that participants need to
                    follow for this segment.
                  </p>
                }
              >
                <RichTextEditor
                  content=""
                  label={`segmentsData.${index}.rules`}
                  register={register}
                />
              </FormLayout>
            </div>
          </FormLayout>
        ))}
        <div className="w-full flex gap-5 items-center flex-wrap">
          <button
            type="button"
            className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
            onClick={() => handleAppend()}
          >
            Add Segment
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => handleRemove(fields.length - 1)}
            >
              Remove Last Segment
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
