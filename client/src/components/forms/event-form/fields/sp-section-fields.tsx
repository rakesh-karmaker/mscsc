import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import { Stack, TextField, Tooltip } from "@mui/material";
import FileInput from "@/components/ui/file-input";

type SpSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function SpSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: SpSectionFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "spData",
  });

  function handleAppend() {
    append({
      name: "",
      logoFile: "",
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
      <div className="w-full h-full flex flex-col gap-10">
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
            cancelButton={
              <Tooltip title="Remove Segment" placement="top" arrow>
                <button
                  type="button"
                  className="primary-button before:bg-red-500! w-fit! min-w-fit! px-3! py-1.5! text-base! font-normal! h-fit! transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleRemove(index)}
                  disabled={fields.length <= 1}
                >
                  Remove
                </button>
              </Tooltip>
            }
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
                  {...register(`spData.${index}.name`, {
                    maxLength: {
                      value: 100,
                      message: "Name cannot exceed 100 characters",
                    },
                    required: isSectionSelected
                      ? "Sponsor/Partner name is required"
                      : false,
                  })}
                  label="Sponsor/Partner Name"
                  error={Boolean(
                    errors.spData &&
                    errors.spData[index] &&
                    errors.spData[index].name,
                  )}
                  helperText={
                    errors.spData &&
                    errors.spData[index] &&
                    errors.spData[index].name &&
                    (errors.spData[index].name.message as string)
                  }
                />

                <FileInput
                  register={register}
                  name={`spData.${index}.logoFile`}
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
                {...register(`spData.${index}.websiteUrl`, {
                  required: isSectionSelected
                    ? "Website URL is required"
                    : false,
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
                    message: "Please enter a valid URL",
                  },
                })}
                label="Website URL"
                multiline
                error={Boolean(
                  errors.spData &&
                  errors.spData[index] &&
                  errors.spData[index].websiteUrl,
                )}
                helperText={
                  errors.spData &&
                  errors.spData[index] &&
                  errors.spData[index].websiteUrl &&
                  (errors.spData[index].websiteUrl.message as string)
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
