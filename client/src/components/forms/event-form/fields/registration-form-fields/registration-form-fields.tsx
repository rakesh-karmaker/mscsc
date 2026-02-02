import { Activity, useState, type ReactNode } from "react";
import { type SetValueConfig } from "react-hook-form";
import FormLayout from "../../form-layout";
import RadioField from "@/components/ui/radio-field";
import { Stack, TextField } from "@mui/material";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import PaymentMethodCard from "./payment-method-card";
import FileInput from "@/components/ui/file-input";

type RegistrationFormFields = {
  register: any;
  errors: { [key: string]: any };
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
};

export default function RegistrationFormFields({
  register,
  errors,
  setValue,
}: RegistrationFormFields): ReactNode {
  const [hasRegistrationForm, setHasRegistrationForm] = useState<string>("no");
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);

  function handleSetHasRegistrationForm(option: string) {
    setHasRegistrationForm(option);
    setValue("isInnerRegistration", option === "yes");
  }

  return (
    <FormLayout
      title={"Registration Form Information"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Configure the details for the Registration Form for this event.
        </p>
      }
    >
      <div className="w-full h-full flex flex-col gap-1.5">
        <RadioField
          options={["yes", "no"]}
          onClick={(option) => handleSetHasRegistrationForm(option)}
          selectedOption={hasRegistrationForm}
          errors={errors.hasRegistrationForm}
        >
          Do you want to make a Registration Form?
        </RadioField>
      </div>
      <div
        className="w-full h-fit overflow-hidden grid transition-all duration-200 ease-in-out"
        style={{
          gridTemplateRows: hasRegistrationForm == "yes" ? "1fr" : "0fr",
        }}
      >
        <div className="flex flex-col gap-4 pt-2! h-fit w-fit overflow-hidden">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ width: "100%" }}
          >
            <TextField
              fullWidth
              variant="outlined"
              {...register("registrationFormTitle", {
                required: "Registration Form title is required",
              })}
              label="Registration Form Title"
              error={Boolean(errors.registrationFormTitle)}
              helperText={errors.registrationFormTitle?.message as string}
            />

            <TextField
              fullWidth
              variant="outlined"
              {...register("registrationFees", {
                required: "Registration Fees is required",
              })}
              label="Registration Fees"
              error={Boolean(errors.registrationFees)}
              helperText={errors.registrationFees?.message as string}
            />
          </Stack>

          <FormLayout
            title="Registration Form Details"
            textSize="lg"
            fontWeight="medium"
            description={
              <p className="w-full min-w-[30ch] h-full">
                Provide detailed information about the Registration process.
              </p>
            }
          >
            <RichTextEditor
              register={register}
              label="registrationFormDetails"
              content=""
            />
          </FormLayout>

          <FormLayout
            title="Payment Methods"
            textSize="lg"
            fontWeight="medium"
            description={
              <p className="w-full min-w-[30ch] h-full">
                Specify the payment methods available for registration.
              </p>
            }
          >
            <div className="w-full flex flex-col gap-3">
              {["bkash", "nagad", "rocket"].map((method) => (
                <div key={method} className="flex flex-col gap-3">
                  <PaymentMethodCard
                    platform={method}
                    isSelected={selectedMethods.includes(method)}
                    onClick={(platform) => {
                      let updatedMethods = [...selectedMethods];
                      if (updatedMethods.includes(platform)) {
                        updatedMethods = updatedMethods.filter(
                          (m) => m !== platform,
                        );
                      } else {
                        updatedMethods.push(platform);
                      }
                      setSelectedMethods(updatedMethods);
                      setValue("paymentMethods", updatedMethods);
                    }}
                  />

                  <Activity
                    mode={
                      selectedMethods.includes(method) ? "visible" : "hidden"
                    }
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{ width: "100%", marginBottom: "16px" }}
                    >
                      <TextField
                        fullWidth
                        variant="outlined"
                        {...register(`paymentDetails.${method}.number`)}
                        label="Account Number"
                        error={Boolean(errors.paymentDetails?.[method]?.number)}
                        helperText={
                          errors.paymentDetails?.[method]?.number
                            ?.message as string
                        }
                        placeholder="e.g., 01XXXXXXXXX"
                      />
                      <div className="w-fit">
                        <FileInput
                          register={register}
                          name={`paymentDetails.${method}.qrCode`}
                          errors={errors}
                          addText={false}
                          className="p-[14px_22px]! min-w-fit!"
                        >
                          Upload QR Code
                        </FileInput>
                      </div>
                    </Stack>
                  </Activity>
                </div>
              ))}
            </div>
          </FormLayout>
        </div>
      </div>
    </FormLayout>
  );
}
