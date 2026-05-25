import { useCallback, useEffect, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import dayjs from "dayjs";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import ScheduleItemFields from "./schedule-fields";

const DEFAULT_SCHEDULE_ITEM = {
  icon: "games",
  date: dayjs(),
  fromTime: dayjs(),
  toTime: dayjs().add(1, "hour"),
  title: "",
  description: "",
};

type ScheduleSectionFieldsProps = {
  register: any;
  control: Control<any>;
  errors: { [key: string]: any };
  isSectionSelected: boolean;
};

export default function ScheduleSectionFields({
  register,
  control,
  errors,
  isSectionSelected,
}: ScheduleSectionFieldsProps): ReactNode {
  const { fields, append, remove, move } = useFieldArray({
    control: control,
    name: "scheduleData",
  });

  const handleAppend = useCallback(() => {
    append(DEFAULT_SCHEDULE_ITEM);
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
      title={"Schedule Section"}
      description={
        <p className="w-full min-w-[30ch] h-full">
          Define the schedule for the event, including dates, times, and
          descriptions of each scheduled item.
        </p>
      }
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
            <ScheduleItemFields
              key={field.id}
              id={field.id}
              index={index}
              field={field}
              handleRemove={handleRemove}
              control={control}
              errors={errors}
              isSectionSelected={isSectionSelected}
              register={register}
              length={fields.length}
            />
          ))}
        </DragDropProvider>
        <div className="w-full flex gap-5 items-center flex-wrap">
          <button
            type="button"
            className="primary-button w-fit! min-w-fit! px-4! py-2! text-base! font-normal! h-fit!"
            onClick={() => handleAppend()}
          >
            Add Schedule Item
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
