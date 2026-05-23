import { useEffect, useState, type ReactNode } from "react";
import { useWatch, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import { Stack, TextField } from "@mui/material";
import { FaGlobeAsia } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { icons } from "@/services/data/icons-data";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import SelectIconField from "@/components/ui/select-icon-field";
import {
  LuArrowDown,
  LuArrowUp,
  LuUserRound,
  LuUsersRound,
} from "react-icons/lu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical } from "react-icons/lu";

export default function SegmentFields({
  id,
  length,
  field,
  index,
  handleRemove,
  control,
  errors,
  isSectionSelected,
  getValues,
  register,
  isDragging,
}: {
  id: string;
  length: number;
  field: Record<"id", string>;
  index: number;
  handleRemove: (index: number) => void;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
  getValues: (payload?: string | string[]) => Object;
  register: any;
  isDragging: boolean;
}): ReactNode {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const title =
    (useWatch({
      control,
      name: `segmentsData.${index}.title`,
    }) as string) || "";
  const [isOpen, setIsOpen] = useState<boolean>(title ? false : true);

  useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
    }
  }, [isDragging]);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FormLayout
        dragger={
          <LuGripVertical
            {...listeners}
            className="cursor-grab touch-none select-none text-xl min-w-5"
          />
        }
        key={field.id}
        title={
          <p className="line-clamp-1">{title || `Segment ${index + 1}`}</p>
        }
        description={
          <p className="w-full min-w-[30ch] h-full">
            Details for segment {index + 1}.
          </p>
        }
        textSize="lg"
        fontWeight="medium"
        cancelButton={
          <div className="w-fit flex items-center gap-2">
            <button
              type="button"
              className="primary-button before:bg-red-500! w-fit! min-w-fit! px-3! py-1.5! text-base! font-normal! h-fit! transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleRemove(index)}
              disabled={length <= 1}
            >
              Remove
            </button>
            <button
              type="button"
              className="primary-button before:bg-highlighted-color! w-fit! min-w-fit! px-3! py-1.5! text-xl! font-normal! h-9! transition disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? <LuArrowUp /> : <LuArrowDown />}
            </button>
          </div>
        }
      >
        <div
          className="w-full h-fit overflow-hidden grid gap-5 transition-all duration-300"
          style={{
            gridTemplateColumns: "1fr",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
          }}
        >
          <div className="w-full flex flex-col gap-5 overflow-hidden">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
              className="pt-5!"
            >
              <SelectIconField
                id={`segments-location-type-${index}`}
                name={`segmentsData.${index}.locationType`}
                icons={{
                  onsite: <IoLocationOutline />,
                  online: <FaGlobeAsia />,
                }}
                control={control}
                hasErrors={Boolean(errors?.segmentsData?.[index]?.locationType)}
                errorMessage={
                  errors.segmentsData?.[index]?.locationType?.message as string
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

              <SelectIconField
                id={`segments-max-team-size-${index}`}
                name={`segmentsData.${index}.maxTeamSize`}
                icons={{
                  "1": <LuUserRound />,
                  "2": <LuUserRound />,
                  "3": <LuUsersRound />,
                }}
                control={control}
                hasErrors={Boolean(errors?.segmentsData?.[index]?.maxTeamSize)}
                errorMessage={
                  errors.segmentsData?.[index]?.maxTeamSize?.message as string
                }
                defaultValue="1"
              >
                Max Team Size (If solo, select 1)
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
                  Provide detailed information about this segment of the event.
                </p>
              }
            >
              <RichTextEditor
                content={
                  (getValues(`segmentsData.${index}.details`) as string) || ""
                }
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
                content={
                  (getValues(`segmentsData.${index}.rules`) as string) || ""
                }
                label={`segmentsData.${index}.rules`}
                register={register}
              />
            </FormLayout>
            <div className="pb-5!" />
          </div>
        </div>
      </FormLayout>
    </div>
  );
}
