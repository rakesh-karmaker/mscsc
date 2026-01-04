import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/use-error-navigator";
import { NavLink, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { loginUser } from "@/lib/api/auth";
import type { ReactNode } from "react";
import {
  loginSchema,
  type LoginSchemaType,
} from "@/lib/validation/login-schema";
import type { AxiosError } from "axios";
import FormSubmitBtn from "@/components/ui/form-submit-btn";

import "./login-form.css";

export default function LoginForm(): ReactNode {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const authMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res.status === 200) {
        const token = res?.data?.token;
        localStorage.setItem("token", token);
        queryClient.invalidateQueries({ queryKey: ["user"] });
        const username = res?.data?.member?.slug;
        setTimeout(() => {
          navigate(`/member/${username}`, { replace: true });
        }, 0);
        toast.success("Login successful!");
      }
    },
    onError: (err: AxiosError<{ message: string; subject: string }>) => {
      toast.error(err.response?.data.message || "Login failed");

      if (!err.response?.data.subject) return;
      setError(err.response.data.subject as keyof LoginSchemaType, {
        message: err.response?.data.message,
      });
      setError("root", {
        message: "Invalid Credentials",
      });

      useErrorNavigator(true, err);
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    authMutation.mutate(data);
  };

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit(onSubmit)}>
      <TextField
        {...register("email")}
        type="email"
        label="Email"
        variant="outlined"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        {...register("password")}
        type="password"
        label="Password"
        variant="outlined"
        fullWidth
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <div>
        <div className="submission">
          <div>
            <NavLink to="/auth/forgot-password">Forgot Password?</NavLink>
          </div>
          <FormSubmitBtn
            isLoading={authMutation.isPending}
            pendingText="Logging in"
            width="100%"
          >
            Login
          </FormSubmitBtn>
          <div className="register-link">
            <p>Don't have an account?</p>
            <NavLink to="/auth/register">Register</NavLink>
          </div>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
    </form>
  );
}
