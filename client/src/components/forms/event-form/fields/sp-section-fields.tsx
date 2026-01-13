import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { Stack, TextField } from "@mui/material";
import FileInput from "@/components/ui/file-input";

type SpSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
};

export default function SpSectionFields({
  register,
  control,
  errors,
}: SpSectionFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "sp",
  });

  function handleAppend() {
    append({
      name: "",
      logo: "",
      websiteUrl: "",
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
      title={"Sponsors & Partners Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The sponsors & partners section highlights the organizations that
          support the event, showcasing their logos and providing links to their
          websites.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-4">
        {fields.map((field, index) => (
          <FormLayout
            key={field.id}
            title={`Sponsor/Partner ${index + 1}`}
            description={
              <p className="w-full min-w-[30ch] h-full">
                Sponsor/Partner {index + 1}.
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
                  {...register(`sp.${index}.name`, {
                    maxLength: {
                      value: 100,
                      message: "Name cannot exceed 100 characters",
                    },
                  })}
                  label="Sponsor/Partner Name"
                  error={Boolean(
                    errors.sp && errors.sp[index] && errors.sp[index].name
                  )}
                  helperText={
                    errors.sp &&
                    errors.sp[index] &&
                    errors.sp[index].name &&
                    (errors.sp[index].name.message as string)
                  }
                />

                <FileInput
                  register={register}
                  name={`sp.${index}.logoFile`}
                  errors={errors}
                  labelText="Upload Logo File"
                  accept="image/*"
                >
                  Upload Logo
                </FileInput>
              </Stack>

              <TextField
                fullWidth
                variant="outlined"
                {...register(`sp.${index}.websiteUrl`, {
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
                    message: "Please enter a valid URL",
                  },
                })}
                label="Website URL"
                multiline
                error={Boolean(
                  errors.sp && errors.sp[index] && errors.sp[index].websiteUrl
                )}
                helperText={
                  errors.sp &&
                  errors.sp[index] &&
                  errors.sp[index].websiteUrl &&
                  (errors.sp[index].websiteUrl.message as string)
                }
                placeholder="Enter the website or social URL of the sponsor/partner."
              />
            </div>
          </FormLayout>
        ))}
        <div className="w-full flex gap-5 items-center flex-wrap">
          <button
            type="button"
            className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
            onClick={() => handleAppend()}
          >
            Add Sponsor/Partner
          </button>
          {fields.length > 1 && (
            <button
              type="button"
              className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit! before:bg-red-500!"
              onClick={() => handleRemove(fields.length - 1)}
            >
              Remove Last Item
            </button>
          )}
        </div>
      </div>
    </FormLayout>
  );
}
