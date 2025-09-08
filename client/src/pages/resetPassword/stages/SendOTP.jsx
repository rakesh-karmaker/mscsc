import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import { TextField } from "@mui/material";
import { forgotPasswordRequest } from "@/lib/api/forgotPassword";

const SendOTP = ({ setEmail, setStage }) => {
  const {
    register,
    handleSubmit,
    setError,
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
      stage={1}
    >
      <form onSubmit={handleSubmit(emailMutation.mutate)}>
        <TextField
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          type="email"
          label="Email"
        />

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
