import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useFieldArray, type Control } from "react-hook-form";
import FormLayout from "../../form-layout";
import dayjs from "dayjs";
import {
  DndContext,
  TouchSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragCancelEvent,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const { fields, append, remove, swap } = useFieldArray({
    control: control,
    name: "scheduleData",
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleAppend = useCallback(() => {
    append(DEFAULT_SCHEDULE_ITEM);
  }, [append]);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 8,
      },
    }),
  );

  const handleDragDrop = useCallback(
    (event: DragEndEvent) => {
      setIsDragging(false);
      if (!event.over || event.active.id === event.over.id) return;

      const startLinkIndex = fields.findIndex(
        (item) => item.id === event.active.id,
      );
      const dropLinkId = event.over?.id;
      if (!dropLinkId) return;

      const dropLinkIndex = fields.findIndex((item) => item.id === dropLinkId);

      if (startLinkIndex < 0 || dropLinkIndex < 0) return;

      swap(startLinkIndex, dropLinkIndex);
    },
    [fields, swap],
  );

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    setIsDragging(true);
  }, []);

  const handleDragCancel = useCallback((_event: DragCancelEvent) => {
    setIsDragging(false);
  }, []);

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
        <DndContext
          collisionDetection={closestCenter}
          onDragCancel={handleDragCancel}
          onDragStart={handleDragStart}
          onDragEnd={handleDragDrop}
          sensors={sensors}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
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
                isDragging={isDragging}
              />
            ))}
          </SortableContext>
        </DndContext>
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
