import { Activity, useState, type ReactNode } from "react";
import { useWatch, type Control, type SetValueConfig } from "react-hook-form";
import FormLayout from "../../form-layout";
import { Stack, TextField } from "@mui/material";
import { icons } from "@/services/data/icons-data";
import RichTextEditor from "@/lib/rich-text-editor/rich-text-editor";
import SelectIconField from "@/components/ui/select-icon-field";
import FaGlobeAsia from "~icons/fa/globe";
import IoLocationOutline from "~icons/ion/location-outline";
import LuArrowDown from "~icons/lucide/arrow-down";
import LuArrowUp from "~icons/lucide/arrow-up";
import LuUserRound from "~icons/lucide/user-round";
import LuUsersRound from "~icons/lucide/users-round";
import LuGripVertical from "~icons/lucide/grip-vertical";
import { useSortable } from "@dnd-kit/react/sortable";
import RadioField from "@/components/ui/radio-field";
import FileInput from "@/components/ui/file-input";
import PaymentMethodCard from "../registration-form-fields/payment-method-card";
import generateUID from "@/utils/generate-uid";

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
  setValue,
  clearErrors,
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
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
  clearErrors: (
    name?: string | string[] | readonly string[] | undefined,
  ) => void;
}): ReactNode {
  const { ref, handleRef } = useSortable({ id: id, index });

  const title =
    (useWatch({
      control,
      name: `segmentsData.${index}.title`,
    }) as string) || "";
  const isPaidSegment =
    (useWatch({
      control,
      name: `segmentsData.${index}.isPaidSegment`,
    }) as boolean) || false;

  const [isOpen, setIsOpen] = useState<boolean>(title ? false : true);
  const [selectedMethods, setSelectedMethods] = useState<string[]>(
    getValues(`segmentsData.${index}.transactionMethods`)
      ? Object.keys(
          getValues(`segmentsData.${index}.transactionMethods`) as Object,
        )
      : [],
  );

  return (
    <div ref={ref}>
      <FormLayout
        dragger={
          <div ref={handleRef} className="cursor-move">
            <LuGripVertical className="cursor-grab touch-none select-none text-xl min-w-5" />
          </div>
        }
        key={field.id}
        title={
          <p className="line-clamp-1">{title || `Segment ${index + 1}`}</p>
        }
        description={
          <p className="w-full  h-full">Details for segment {index + 1}.</p>
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
        id={`segment-${index}`}
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

              <TextField
                fullWidth
                variant="outlined"
                {...register(`segmentsData.${index}.fees`, {
                  required: isSectionSelected
                    ? "Segment fees is required"
                    : false,
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid fee amount",
                  },
                })}
                label="Segment Fees (Only if paid)"
                error={Boolean(
                  errors.segmentsData &&
                  errors.segmentsData[index] &&
                  errors.segmentsData[index].fees,
                )}
                helperText={
                  errors.segmentsData &&
                  errors.segmentsData[index] &&
                  errors.segmentsData[index].fees &&
                  (errors.segmentsData[index].fees.message as string)
                }
                defaultValue={"0"}
              />
            </Stack>

            <div className="w-full h-full flex flex-col gap-1.5">
              <RadioField
                options={["yes", "no"]}
                onClick={(option) => {
                  setValue(
                    `segmentsData.${index}.isPaidSegment`,
                    option === "yes",
                  );
                  if (option === "no") {
                    setValue(`segmentsData.${index}.fees`, "0");
                    setValue(`segmentsData.${index}.transactionPlatforms`, []);
                    setSelectedMethods([]);
                    clearErrors([
                      `segmentsData.${index}.fees`,
                      `segmentsData.${index}.transactionPlatforms`,
                    ]);
                  }
                }}
                selectedOption={isPaidSegment ? "yes" : "no"}
                errors={errors.segmentsData?.[index]?.isPaidSegment}
              >
                Is this a paid segment?
              </RadioField>
              <Activity mode={isPaidSegment ? "visible" : "hidden"}>
                <FormLayout
                  title="Payment Methods"
                  textSize="lg"
                  fontWeight="medium"
                  description={
                    <p className="w-full  h-full">
                      Specify the payment methods available for this segment.
                    </p>
                  }
                  id="payment-methods"
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
                            setValue(
                              `segmentsData.${index}.transactionPlatforms`,
                              updatedMethods,
                            );
                            setSelectedMethods(updatedMethods);
                            if (updatedMethods.length > 0) {
                              clearErrors(
                                `segmentsData.${index}.transactionPlatforms`,
                              );
                            }
                          }}
                        />

                        {selectedMethods.includes(method) && (
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            sx={{ width: "100%", marginBottom: "16px" }}
                          >
                            <TextField
                              fullWidth
                              variant="outlined"
                              {...register(
                                `segmentsData.${index}.transactionMethods.${method}.number`,
                                {
                                  required:
                                    selectedMethods.includes(method) &&
                                    isPaidSegment === true
                                      ? "Account number is required"
                                      : false,
                                },
                              )}
                              label="Account Number"
                              error={Boolean(
                                errors.segmentsData?.[index]
                                  ?.transactionMethods?.[method]?.number,
                              )}
                              helperText={
                                errors.segmentsData?.[index]
                                  ?.transactionMethods?.[method]?.number
                                  ?.message as string
                              }
                              placeholder="e.g., 01XXXXXXXXX"
                            />
                            <div className="w-fit">
                              <FileInput
                                register={register}
                                name={`segmentsData.${index}.transactionMethods.${method}.qrCode`}
                                errors={errors}
                                addText={false}
                                className="p-[14px_22px]! min-w-fit!"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];

                                  if (file) {
                                    const uid = generateUID();
                                    const extension = file.name.includes(".")
                                      ? file.name.slice(
                                          file.name.lastIndexOf("."),
                                        )
                                      : "";
                                    const renamedFile = new File(
                                      [file as Blob],
                                      `${uid}${extension}`,
                                      {
                                        type: file.type,
                                      },
                                    );
                                    setValue(
                                      `segmentsData.${index}.transactionMethods.${method}.qrCode`,
                                      renamedFile,
                                      {
                                        shouldValidate: true,
                                      },
                                    );
                                    setValue(
                                      `segmentsData.${index}.transactionMethods.${method}.code`,
                                      uid,
                                      { shouldValidate: false },
                                    );
                                  }
                                }}
                              >
                                {getValues(
                                  `segmentsData.${index}.transactionMethods.${method}.qrCodeUrl`,
                                )
                                  ? "Change"
                                  : "Upload"}{" "}
                                QR Code
                              </FileInput>
                            </div>
                          </Stack>
                        )}
                      </div>
                    ))}
                  </div>
                </FormLayout>
              </Activity>
            </div>

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
                <p className="w-full  h-full">
                  Provide detailed information about this segment of the event.
                </p>
              }
              id={`segment-details-${index}`}
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
                <p className="w-full  h-full">
                  Specify any rules or guidelines that participants need to
                  follow for this segment.
                </p>
              }
              id={`segment-rules-${index}`}
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
