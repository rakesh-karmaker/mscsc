import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { YearRadio, BranchRadio } from "@/components/UI/RegRadios";
import FileInput from "@/components/UI/FileInput/FileInput";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import "./UserForm.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUser } from "@/services/PutService";
import { registerUser } from "@/services/PostService";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import useLoadingToast from "@/hooks/useLoadingToast";
import CheckBox from "../UI/Checkbox/Checkbox";

const UserForm = (props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(props.schema),
    defaultValues: props?.data
      ? {
          name: props.data.name,
          email: props.data.email,
          password: "",
          contactNumber: props.data.contactNumber,
          branch: props.data.branch,
          reason: props.data.reason,
          socialLink: props.data.socialLink,
          batch: props.data.batch,
        }
      : undefined,
    mode: "onChange",
  });

  const userMutation = useMutation({
    mutationFn: (editedProps) => {
      const { method, setError, ...data } = editedProps;
      if (method === "register") {
        return registerUser(data);
      } else {
        data._id = props.data._id;
        return editUser(data);
      }
    },

    onSuccess: (data) => {
      toast.success(data?.data?.message);
      if (data?.data?.subject === "register") {
        localStorage.setItem("token", data?.data?.token);
        queryClient.invalidateQueries({ queryKey: ["members"] });
        setUser(data?.data?.member);
        navigate(`/member/${data?.data?.member?._id}`, { replace: true });
      } else {
        queryClient.invalidateQueries({ queryKey: ["user"] });
        window.scrollTo(0, 0);
      }
    },

    onError: (err) => {
      if (err.status === 409) {
        setError("email", {
          message: err.response.data.message,
        });
      } else {
        useErrorNavigator(true, err);
      }
      setError("root", {
        message: err.response.data.message,
      });
      toast.error(err.response.data.message);
    },
  });

  const onSubmit = async (data) => {
    userMutation.mutate({
      method: props?.setForm ? "register" : "edit",
      setError,
      ...data,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
      <div className="combined-inputs">
        <InputText
          setValue={setValue}
          trigger={trigger}
          register={register}
          errors={errors.name}
          id="name"
        >
          Full Name
        </InputText>
        <InputText
          setValue={setValue}
          trigger={trigger}
          register={register}
          errors={errors.email}
          id="email"
        >
          Email
        </InputText>
      </div>

      <InputText
        setValue={setValue}
        trigger={trigger}
        register={register}
        errors={errors.password}
        type="password"
        id="password"
        required={props?.setForm ?? false}
      >
        {props?.setForm ? "Password" : "New Password"}
      </InputText>

      {props?.setForm && <YearRadio register={register} errors={errors} />}

      <BranchRadio register={register} errors={errors} />

      <FileInput register={register("image")} errors={errors.image}>
        {props?.setForm ? "Give us your formal photo:" : "Edit your photo:"}
      </FileInput>

      <InputText
        setValue={setValue}
        trigger={trigger}
        register={register}
        errors={errors.reason}
        id="reason"
      >
        Your Description
      </InputText>

      <div className="combined-inputs">
        <LinkBatch
          register={register}
          trigger={trigger}
          errors={errors}
          setValue={setValue}
          {...props}
        />

        {props?.setForm && (
          <InputText
            setValue={setValue}
            trigger={trigger}
            register={register}
            errors={errors.reference}
            id="reference"
          >
            Reference
          </InputText>
        )}
      </div>
      <div className="checkbox-submission">
        {/* <CheckBox
          register={register("consent", { required: true })}
          id="consent"
        >
          I agree to share my profile details with members.
        </CheckBox> */}
        <div className="submission">
          {props?.setForm ? (
            <div className="state-redirect">
              <p>Already have an account?</p>
              <button onClick={() => props.setForm("Login")} type="button">
                Login Now
              </button>
            </div>
          ) : null}
          <SubmitBtn
            isLoading={userMutation.isPending}
            errors={errors}
            pendingText={props?.setForm ? "Registering" : "Updating"}
          >
            {props?.setForm ? "Register as a Member" : "Update"}
          </SubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
    </form>
  );
};

const LinkBatch = ({ register, trigger, setValue, errors, ...rest }) => {
  if (rest?.setForm) {
    return (
      <InputText
        setValue={setValue}
        trigger={trigger}
        register={register}
        errors={errors.socialLink}
        id="socialLink"
      >
        Facebook Link
      </InputText>
    );
  } else {
    return (
      <div className="combined-inputs">
        <InputText
          setValue={setValue}
          trigger={trigger}
          register={register}
          errors={errors.socialLink}
          id="socialLink"
        >
          Facebook Link
        </InputText>

        <InputText
          setValue={setValue}
          trigger={trigger}
          register={register}
          errors={errors.batch}
          id="batch"
        >
          SSC Batch
        </InputText>
      </div>
    );
  }
};

export default UserForm;
