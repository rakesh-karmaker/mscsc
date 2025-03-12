import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import { resetPassword } from "@/services/PostService";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import { TextField } from "@mui/material";

const ResetPassword = ({ email, token, setStage }) => {
  const {
    register,
    handleSubmit,
    setError,
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
      image={"/edit.png"}
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
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <SubmitBtn
          isLoading={passwordMutation.isPending}
          pendingText="Updating..."
          width="100%"
        >
          Reset Password
        </SubmitBtn>
      </form>
    </ForgotPasswordLayout>
  );
};

export default ResetPassword;
