import { useCallback, useEffect, type ReactNode } from "react";
import {
  useFieldArray,
  type Control,
  type SetValueConfig,
} from "react-hook-form";
import FormLayout from "../../form-layout";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import SegmentFields from "./segment-fields";

const DEFAULT_SEGMENT = {
  title: "",
  details: "",
  locationType: "onsite",
  teamType: "solo",
  maxTeamSize: "1",
  icon: "bulb",
  summary: "",
  rules: "",
  isPaidSegment: false,
  fees: "0",
};

type SegmentsSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
  getValues: (payload?: string | string[]) => Object;
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
};

export default function SegmentsSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
  getValues,
  setValue,
}: SegmentsSectionFieldsProps): ReactNode {
  const { fields, append, remove, move } = useFieldArray({
    control: control,
    name: "segmentsData",
  });

  const handleAppend = useCallback(() => {
    append(DEFAULT_SEGMENT);
  }, [append]);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  useEffect(() => {
    if (fields.length === 0) {
      handleAppend();
    }
  }, [fields.length, handleAppend]);

  return (
    <FormLayout
      title={"Segments Section"}
      description={
        <p className="w-full  h-full">
          The segments section is a part of the event page that typically
          contains various segments or parts related to the event.
        </p>
      }
      id="segments-section"
    >
      <div className="w-full h-full flex flex-col gap-0 max-sm:gap-3">
        <DragDropProvider
          onDragEnd={(event) => {
            if (event.canceled) return;
            const { source } = event.operation;

            if (isSortable(source)) {
              const { initialIndex, index } = source;
              if (initialIndex !== index) {
                move(initialIndex, index);
              }
            }
          }}
        >
          {fields.map((field, index) => (
            <SegmentFields
              id={field.id}
              key={field.id}
              field={field}
              index={index}
              length={fields.length}
              handleRemove={handleRemove}
              control={control}
              errors={errors}
              isSectionSelected={isSectionSelected}
              getValues={getValues}
              register={register}
              setValue={setValue}
            />
          ))}
        </DragDropProvider>
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
