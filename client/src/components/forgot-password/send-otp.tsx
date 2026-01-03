import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TextField } from "@mui/material";
import { forgotPasswordRequest } from "@/lib/api/forgot-password";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import ForgotPasswordLayout from "@/layouts/forgot-password-layout";
import FormSubmitBtn from "../ui/form-submit-btn";
import type { AxiosError } from "axios";

export default function SendOTP({
  setEmail,
  setStage,
}: {
  setEmail: Dispatch<SetStateAction<string>>;
  setStage: Dispatch<SetStateAction<number>>;
}): ReactNode {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const emailMutation = useMutation({
    mutationFn: (email: string) => forgotPasswordRequest(email),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setEmail(res.data.email);
      setStage(2);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(err.response?.data.message || "Failed to send OTP");
      setError("email", {
        message: err.response?.data.message,
      });
    },
  });

  function onSubmit(data: { email: string }) {
    emailMutation.mutate(data.email);
  }

  return (
    <ForgotPasswordLayout
      title="Forgot Password?"
      description="Enter your email and will send you an OTP to reset your password."
      stage={1}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          type="email"
          label="Email"
        />

        <FormSubmitBtn
          isLoading={emailMutation.isPending}
          pendingText="Sending OTP"
          width="100%"
        >
          Send OTP
        </FormSubmitBtn>
      </form>
    </ForgotPasswordLayout>
  );
}
