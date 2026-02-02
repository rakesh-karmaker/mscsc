import { useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../form-layout";
import SelectIconField from "@/components/ui/select-icon-field";
import { socialMediaIcons } from "@/services/data/icons-data";
import {
  AddSocialLinkButton,
  RemoveSocialLinkButton,
} from "@/components/ui/btns";
import { TextField } from "@mui/material";

type ContactInfoFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
};

export default function ContactInfoFields({
  register,
  control,
  errors,
}: ContactInfoFieldsProps): ReactNode {
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "contactLinks",
  });

  function handleAppend() {
    append({
      platform: "",
      url: "",
    });
  }

  useEffect(() => {
    if (fields.length === 0) {
      handleAppend();
    }
  }, [fields, append]);

  return (
    <FormLayout
      title={"Contact Information"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          The contact information section provides links to various social media
          platforms or contact methods related to the event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="w-full h-full flex gap-1 max-md:gap-3 items-center max-md:flex-col"
          >
            <div className="w-[40%] flex justify-between max-md:w-full max-md:gap-3 items-center">
              <div className="min-w-70.5 max-lg:min-w-50">
                <SelectIconField
                  id={`contactLinks-icon-${index}`}
                  name={`contactLinks.${index}.platform`}
                  icons={socialMediaIcons}
                  control={control}
                  hasErrors={Boolean(errors?.contactLinks?.[index]?.platform)}
                  errorMessage={
                    errors.contactLinks?.[index]?.platform?.message as string
                  }
                  defaultValue="facebook"
                >
                  Icon
                </SelectIconField>
              </div>

              <div className="hidden gap-1 max-md:flex">
                {fields.length > 1 ? (
                  <RemoveSocialLinkButton remove={remove} index={index} />
                ) : null}
                {index == fields.length - 1 && (
                  <AddSocialLinkButton append={handleAppend} />
                )}
              </div>
            </div>

            <TextField
              {...register(`contactLinks.${index}.url`)}
              label="Link"
              variant="outlined"
              error={!!errors.contactLinks?.[index]?.url}
              helperText={errors.contactLinks?.[index]?.url?.message}
              className="w-full"
              placeholder="Enter url"
              fullWidth
            />

            <div className="flex gap-1 max-md:hidden">
              {fields.length > 1 ? (
                <RemoveSocialLinkButton remove={remove} index={index} />
              ) : null}
              {index == fields.length - 1 && (
                <AddSocialLinkButton append={handleAppend} />
              )}
            </div>
          </div>
        ))}
      </div>
    </FormLayout>
  );
}
