import Editor from "@/components/UI/Editor/Editor";
import FormHeading from "@/components/UI/FormHeading/FormHeading";
import InputText, { TextArea } from "@/components/UI/InputText/InputText";
import RadioList from "@/components/UI/RadioList/RadioList";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { addTask } from "@/services/PostService";
import { editTask } from "@/services/PutService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import "./TaskForm.css";
import CheckBox from "@/components/UI/Checkbox/Checkbox";
import { useEffect } from "react";

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
        deadline: new Date(props.defaultValues?.deadline)
          .toISOString()
          .split("T")[0],
        category: props.defaultValues?.category,
        imageRequired: props.defaultValues?.imageRequired ?? false,
      }
    : {};

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const categories = ["article writing", "poster design"];

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
    const { content, ...rest } = data;
    taskMutation.mutate({
      method: props?.method ?? "add",
      instructions: content,
      ...rest,
    });
  };

  return (
    <div className="task-form-container">
      <FormHeading style={{ fontSize: "42px", lineHeight: "52px" }}>
        {props?.method == "add" ? "Add Task" : "Edit Task"}
      </FormHeading>

      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="combined-inputs">
          <InputText
            register={register}
            errors={errors.name}
            setValue={setValue}
            trigger={trigger}
            id="name"
          >
            Task Name
          </InputText>
          <InputText
            register={register}
            errors={errors.deadline}
            id="deadline"
            setValue={setValue}
            trigger={trigger}
            type="date"
          >
            Deadline
          </InputText>
        </div>

        <TextArea register={register("summary")} errors={errors.summary}>
          Task Summary
        </TextArea>

        <RadioList
          register={register("category")}
          errors={errors.category}
          dataList={categories}
        >
          Category
        </RadioList>

        <CheckBox register={register("imageRequired")} id="imageRequired">
          Image Required
        </CheckBox>

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
