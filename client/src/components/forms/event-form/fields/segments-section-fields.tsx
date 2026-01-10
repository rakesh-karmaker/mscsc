import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { FaGlobeAsia } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { icons } from "@/services/data/icons-data";
import capitalize from "@/utils/capitalize";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";

type SegmentsSectionFieldsProps = {
  register: any;
  control: Control<any>;
  getValues: (payload?: string | string[]) => Object;
  errors: { [key: string]: any };
};

export default function SegmentsSectionFields({
  register,
  control,
  getValues,
  errors,
}: SegmentsSectionFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "segments",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({
        title: "",
        content: "",
        icon: "",
        locationType: "",
        teamType: "",
        summary: "",
        rules: "",
      });
    }
  }, [fields, append]);

  console.log("errors in segments section:", errors);

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
      <div className="w-full h-full flex flex-col gap-4">
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
          >
            <div className="w-full flex flex-col gap-4">
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <div className="w-full flex flex-col gap-2">
                  <FormControl
                    fullWidth
                    error={Boolean(
                      getValues(`segments.${index}.locationType`) === ""
                    )}
                  >
                    <InputLabel id={`segments-location-type`}>
                      Location Type
                    </InputLabel>
                    <Select
                      labelId={`segments-location-type`}
                      id={`segments-location-type`}
                      {...register(`segments.${index}.locationType`)}
                      label={`Location Type`}
                      error={Boolean(
                        getValues(`segments.${index}.locationType`) === ""
                      )}
                    >
                      <MenuItem value={"onsite"}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <IoLocationOutline />
                          <span>On Site</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value={"online"}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <FaGlobeAsia />
                          <span>Online</span>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {errors.segments &&
                    errors.segments[index] &&
                    errors.segments[index].locationType && (
                      <p className="text-red-600 text-sm">
                        {errors.segments[index].locationType.message as string}
                      </p>
                    )}
                </div>

                <div key={field.id} className="w-full flex flex-col gap-2">
                  <FormControl
                    fullWidth
                    error={Boolean(
                      getValues(`segments.${index}.teamType`) === ""
                    )}
                  >
                    <InputLabel id={`segments-team-type`}>Team Type</InputLabel>
                    <Select
                      labelId={`segments-team-type`}
                      id={`segments-team-type`}
                      {...register(`segments.${index}.teamType`)}
                      label={`Team Type`}
                      error={Boolean(
                        getValues(`segments.${index}.teamType`) === ""
                      )}
                    >
                      <MenuItem value={"solo"}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span>Solo</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value={"team"}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span>Team</span>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  {errors.segments &&
                    errors.segments[index] &&
                    errors.segments[index].teamType && (
                      <p className="text-red-600 text-sm">
                        {errors.segments[index].teamType.message as string}
                      </p>
                    )}
                </div>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  {...register(`segments.${index}.title`, {
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters",
                    },
                  })}
                  label="Segment Title"
                  error={Boolean(
                    errors.segments &&
                      errors.segments[index] &&
                      errors.segments[index].title
                  )}
                  helperText={
                    errors.segments &&
                    errors.segments[index] &&
                    errors.segments[index].title &&
                    (errors.segments[index].title.message as string)
                  }
                />

                <div key={field.id} className="w-full flex flex-col gap-2">
                  <FormControl
                    fullWidth
                    error={Boolean(getValues(`segments.${index}.icon`) === "")}
                  >
                    <InputLabel id={`segments-icon-${index}`}>
                      Segment Icon
                    </InputLabel>
                    <Select
                      labelId={`segments-icon-${index}`}
                      id={`segments-icon-${index}`}
                      {...register(`segments.${index}.icon`)}
                      label={`Segment Icon`}
                      error={Boolean(
                        getValues(`segments.${index}.icon`) === ""
                      )}
                    >
                      {Object.keys(icons).map((iconName) => (
                        <MenuItem
                          key={`segments-${index}-${iconName}`}
                          value={iconName}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {icons[iconName]}
                            {capitalize(iconName)}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.segments &&
                    errors.segments[index] &&
                    errors.segments[index].icon && (
                      <p className="text-red-600 text-sm">
                        {errors.segments[index].icon.message as string}
                      </p>
                    )}
                </div>
              </Stack>

              <TextField
                fullWidth
                variant="outlined"
                {...register(`segments.${index}.summary`)}
                label="Segment Summary"
                placeholder="A brief summary of the segment."
                multiline
                minRows={4}
                error={Boolean(
                  errors.segments &&
                    errors.segments[index] &&
                    errors.segments[index].summary
                )}
                helperText={
                  errors.segments &&
                  errors.segments[index] &&
                  errors.segments[index].summary &&
                  (errors.segments[index].summary.message as string)
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
                  label={`segments.${index}.Details`}
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
                  label={`segments.${index}.rules`}
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
            onClick={() =>
              append({
                title: "",
                content: "",
                icon: "",
                locationType: "",
                teamType: "",
                summary: "",
                rules: "",
              })
            }
          >
            Add Segment
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => remove(fields.length - 1)}
            >
              Remove Last Segment
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
