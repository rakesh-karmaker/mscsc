import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { Stack, TextField } from "@mui/material";
import { icons } from "@/services/data/icons-data";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import SelectIconField from "@/components/ui/select-icon-field";

type ExperiencesFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
};

export default function ExperiencesFields({
  register,
  control,
  errors,
}: ExperiencesFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "experiences",
  });

  function handleAppend() {
    append({
      icon: "games",
      title: "",
      details: "",
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
      title={"Experiences"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Define the different experiences such as workshops, talks, and
          activities that make up the event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-4">
        {fields.map((field, index) => (
          <FormLayout
            key={field.id}
            title={`Experience ${index + 1}`}
            description={
              <p className="w-full min-w-[30ch] h-full">
                Details for experience {index + 1}.
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
                <TextField
                  fullWidth
                  variant="outlined"
                  {...register(`experiences.${index}.title`, {
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters",
                    },
                  })}
                  label="Segment Title"
                  error={Boolean(
                    errors.experiences &&
                      errors.experiences[index] &&
                      errors.experiences[index].title
                  )}
                  helperText={
                    errors.experiences &&
                    errors.experiences[index] &&
                    errors.experiences[index].title &&
                    (errors.experiences[index].title.message as string)
                  }
                />

                <SelectIconField
                  id={`experiences-icon-${index}`}
                  name={`experiences.${index}.icon`}
                  icons={icons}
                  control={control}
                  hasErrors={Boolean(errors?.experiences?.[index]?.icon)}
                  errorMessage={
                    errors.experiences?.[index]?.icon?.message as string
                  }
                  defaultValue="games"
                >
                  Experience Icon
                </SelectIconField>
              </Stack>

              <FormLayout
                title="Details"
                textSize="lg"
                fontWeight="medium"
                description={
                  <p className="w-full min-w-[30ch] h-full">
                    Provide detailed information about this experience of the
                    event.
                  </p>
                }
              >
                <RichTextEditor
                  content=""
                  label={`experiences.${index}.content`}
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
            Add Experience
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => handleRemove(fields.length - 1)}
            >
              Remove Last Experience
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
