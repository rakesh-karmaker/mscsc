import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberLoginSchema } from "@/utils/MemberSchemaValidation";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import "./Login.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { NavLink, useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import { loginUser } from "@/lib/api/auth";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(MemberLoginSchema),
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
    onError: (err) => {
      toast.error(err.response.data.message);
      setError(err.response.data.subject, {
        message: err.response.data.message,
      });
      setError("root", {
        message: "Invalid Credentials",
      });
      useErrorNavigator(true, err);
    },
  });

  const onSubmit = (data) => {
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
          <SubmitBtn
            isLoading={authMutation.isPending}
            errors={errors}
            pendingText="Logging in"
            width="100%"
          >
            Login
          </SubmitBtn>
          <div className="register-link">
            <p>Don't have an account?</p>
            <NavLink to="/auth/register">Register</NavLink>
          </div>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
    </form>
  );
};

export default Login;
