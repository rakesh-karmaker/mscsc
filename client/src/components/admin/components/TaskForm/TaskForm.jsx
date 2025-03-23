import Editor from "@/components/UI/Editor/Editor";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { addTask } from "@/services/PostService";
import { editTask } from "@/services/PutService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import "./TaskForm.css";
import { useEffect } from "react";
import DateTimePicker from "@/components/UI/dateTimePicker/DateTimePicker";
import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import SelectInput from "@/components/UI/SelectInput";

const TaskForm = (props) => {
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
      }
    : {
        category: "",
        imageRequired: false,
      };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
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
    mutationFn: (data) => {
      const { method, ...rest } = data;
      if (method == "add") {
        return addTask(rest);
      } else if (method == "edit") {
        const slug = props.defaultValues.slug;
        rest.slug = slug;
        return editTask(rest);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries("tasks");
      toast.success(res?.data?.message);
      props?.method == "edit" && props?.setSelectedTask(null);
      navigate("/admin/task/" + res?.data?.slug);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  const onSubmit = (data) => {
    data.deadline = data.deadline.toISOString();
    const { content, ...rest } = data;
    taskMutation.mutate({
      method: props?.method ?? "add",
      instructions: content ? content : props.defaultValues?.instructions,
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
            error={errors.name}
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
                onChange={(date) => field.onChange(date)}
                error={errors.deadline}
                helperText={errors.deadline?.message}
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
          error={errors.summary}
          helperText={errors.summary?.message}
          fullWidth
          rows={3}
        />

        <SelectInput
          control={control}
          name="category"
          errors={errors.category}
          dataList={categories}
        >
          Category
        </SelectInput>

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

        <Editor
          register={register("content")}
          content={props?.defaultValues?.instructions ?? ""}
          placeholder="Type instructions here…"
        />

        <SubmitBtn
          isLoading={taskMutation.isPending}
          pendingText={props?.method == "add" ? "Adding" : "Updating"}
        >
          {props?.method == "add" ? "Add Task" : "Update Task"}
        </SubmitBtn>
      </form>
    </div>
  );
};

export default TaskForm;
