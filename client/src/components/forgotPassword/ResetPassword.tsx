import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { TextField } from "@mui/material";
import { resetPassword } from "@/lib/api/forgotPassword";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type { AxiosError } from "axios";
import FormSubmitBtn from "../ui/FormSubmitBtn";

export default function ResetPassword({
  email,
  token,
  setStage,
}: {
  email: string;
  token: string;
  setStage: Dispatch<SetStateAction<number>>;
}): ReactNode {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { email: string; token: string; newPassword: string }) =>
      resetPassword(data.email, data.token, data.newPassword),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setStage(4);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "Password reset failed");
      setError("newPassword", {
        message: err.response?.data.message,
      });
    },
  });

  const onSubmit = (data: { newPassword: string }) => {
    const newPassword = data.newPassword.trim();

    if (!newPassword) {
      setError("newPassword", {
        message: "Password is required",
      });
    } else if (newPassword.length < 6) {
      setError("newPassword", {
        message: "Password must be at least 6 characters",
      });
    } else {
      passwordMutation.mutate({ email, newPassword: newPassword, token });
    }
  };

  return (
    <ForgotPasswordLayout
      title="Set new password"
      description="Enter your new password."
      stage={3}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("newPassword")}
          type="password"
          label="New Password"
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors.newPassword}
          helperText={errors.newPassword?.message}
        />

        <FormSubmitBtn
          isLoading={passwordMutation.isPending}
          pendingText="Updating..."
          width="100%"
        >
          Reset Password
        </FormSubmitBtn>
      </form>
    </ForgotPasswordLayout>
  );
}
