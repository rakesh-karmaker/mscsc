import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import type { Task } from "@/types/taskTypes";
import FormHeading from "@/components/ui/formHeading/FromHeading";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import RichTextEditor from "@/lib/richTextEditor/RichTextEditor";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, type TaskSchemaType } from "@/lib/validation/taskSchema";
import FormSubmitBtn from "@/components/ui/FormSubmitBtn";
import { addTask, editTask } from "@/lib/api/task";
import type { AxiosError, AxiosResponse } from "axios";

import "./taskForm.css";

type TaskFormProps = {
  defaultValues?: Task;
  method?: "add" | "edit";
  setSelectedTask?: Dispatch<SetStateAction<Task | null>>;
};

export default function TaskForm(props: TaskFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const defaultValues = props?.defaultValues
    ? {
        name: props.defaultValues?.name,
        summary: props.defaultValues?.summary,
        deadline: dayjs(props.defaultValues?.deadline),
        category: props.defaultValues?.category,
        imageRequired: props.defaultValues?.imageRequired ?? false,
        content: props.defaultValues?.instructions ?? "",
      }
    : {
        name: "",
        summary: "",
        deadline: dayjs(),
        category: "",
        imageRequired: false,
        content: "",
      };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const categories = [
    {
      value: "article writing",
      label: "Article Writing",
    },
    {
      value: "poster design",
      label: "Poster Design",
    },
  ];

  const taskMutation = useMutation({
    mutationFn: (
      data: Omit<TaskSchemaType, "content" | "deadline"> & {
        method: "add" | "edit";
        instructions: string;
        deadline: string;
      }
    ) => {
      const { method, ...rest } = data;
      if (method == "add") {
        const imageRequired =
          rest.imageRequired ?? props?.defaultValues?.imageRequired ?? false;
        return addTask({
          ...rest,
          imageRequired: imageRequired.toString(),
        });
      } else if (method == "edit") {
        const imageRequired =
          rest.imageRequired ?? props?.defaultValues?.imageRequired ?? false;
        const slug = props.defaultValues?.slug || "";
        return editTask({
          ...rest,
          imageRequired: imageRequired.toString(),
          slug,
        });
      }

      return Promise.reject("Invalid method");
    },
    onSuccess: (res: AxiosResponse) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success(res?.data?.message);
      if (props?.method == "edit" && props?.setSelectedTask) {
        props?.setSelectedTask(null);
      }
      navigate("/admin/task/" + res?.data?.slug);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err?.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = (data: TaskSchemaType) => {
    const { content, deadline, ...rest } = data;
    taskMutation.mutate({
      method: props?.method ?? "add",
      instructions: content ? content : props.defaultValues?.instructions || "",
      deadline: deadline.toISOString(),
      ...rest,
    });
  };

  return (
    <div className="task-form-container">
      <FormHeading style={{ fontSize: "42px", lineHeight: "52px" }}>
        {props?.method == "add" ? "Add Task" : "Edit Task"}
      </FormHeading>

      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <TextField
            {...register("name")}
            type="text"
            label="Task Name"
            variant="outlined"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />

          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                {...field}
                value={field.value || defaultValues.deadline}
                onChange={(date: Dayjs | null) => field.onChange(date)}
                label="Deadline"
              />
            )}
          />
        </Stack>

        <TextField
          {...register("summary")}
          type="text"
          label="Task Summary"
          variant="outlined"
          multiline
          error={!!errors.summary}
          helperText={errors.summary?.message}
          fullWidth
          rows={3}
        />

        <FormControl fullWidth error={!!errors.category}>
          <InputLabel id={"select-category"}>Category</InputLabel>
          <Controller
            name={"category"}
            control={control}
            render={({ field }) => (
              <Select
                labelId={"select-category"}
                id={"select-id-category"}
                label={"Category"}
                {...field}
              >
                {categories.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.category?.message && (
            <p style={{ color: "red" }}>{String(errors.category?.message)}</p>
          )}
        </FormControl>

        <Controller
          name="imageRequired"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Switch {...field} checked={field.value} />}
              label="Image Required"
            />
          )}
        />

        <RichTextEditor
          register={register}
          content={props?.defaultValues?.instructions ?? ""}
        />

        <FormSubmitBtn
          isLoading={taskMutation.isPending}
          pendingText={props?.method == "add" ? "Adding" : "Updating"}
        >
          {props?.method == "add" ? "Add Task" : "Update Task"}
        </FormSubmitBtn>
      </form>
    </div>
  );
}
