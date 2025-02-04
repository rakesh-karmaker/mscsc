import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import { resetPassword } from "@/services/PostService";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";

const ResetPassword = ({ email, token, setStage }) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();
  const passwordMutation = useMutation({
    mutationFn: (data) =>
      resetPassword(data.email, data.token, data.newPassword),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setStage(4);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      setError("newPassword", {
        message: err.response.data.message,
      });
    },
  });

  const onSubmit = (data) => {
    passwordMutation.mutate({ email, newPassword: data.newPassword, token });
  };

  return (
    <ForgotPasswordLayout
      title="Set new password"
      description="Enter your new password."
      image={"/edit.png"}
      stage={3}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputText
          register={register}
          setValue={setValue}
          trigger={trigger}
          errors={errors.newPassword}
          id="newPassword"
          type="password"
        >
          New Password
        </InputText>

        <SubmitBtn
          isLoading={passwordMutation.isPending}
          pendingText="Sending OTP"
          width="100%"
        >
          Reset Password
        </SubmitBtn>
      </form>
    </ForgotPasswordLayout>
  );
};

export default ResetPassword;
