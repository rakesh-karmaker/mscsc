import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "@/services/PostService";
import { useForm } from "react-hook-form";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";

const SendOTP = ({ setEmail, setStage }) => {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
    formState: { errors },
  } = useForm();

  const emailMutation = useMutation({
    mutationFn: (data) => forgotPasswordRequest({ email: data.email }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setEmail(res.data.email);
      setStage(2);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message);
      setError("email", {
        message: err.response.data.message,
      });
    },
  });

  return (
    <ForgotPasswordLayout
      title="Forgot Password?"
      description="Enter your email and will send you an OTP to reset your password."
      image="/forgot.png"
    >
      <form onSubmit={handleSubmit(emailMutation.mutate)}>
        <InputText
          register={register}
          setValue={setValue}
          trigger={trigger}
          errors={errors.email}
          id="email"
          type="email"
        >
          Email
        </InputText>

        <SubmitBtn
          isLoading={emailMutation.isPending}
          pendingText="Sending OTP"
          width="100%"
        >
          Send OTP
        </SubmitBtn>
      </form>
    </ForgotPasswordLayout>
  );
};

export default SendOTP;
