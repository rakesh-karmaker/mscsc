import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberLoginSchema } from "@/utils/MemberSchemaValidation";
import { loginUser } from "@/services/PostService";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast from "react-hot-toast";
import "./Login.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    trigger,
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
      <InputText
        setValue={setValue}
        trigger={trigger}
        register={register}
        errors={errors.email}
        id="email"
      >
        Email
      </InputText>
      <InputText
        setValue={setValue}
        trigger={trigger}
        register={register}
        errors={errors.password}
        type="password"
        id="password"
      >
        Password
      </InputText>

      <div>
        <div className="submission">
          <div className="state-redirect">
            <div>
              <NavLink to="/forgot-password">Forgot Password?</NavLink>
            </div>
            <div>
              <p>Don't have an account?</p>
              <NavLink to="/register">Register</NavLink>
            </div>
          </div>
          <SubmitBtn
            isLoading={authMutation.isPending}
            errors={errors}
            pendingText="Logging in"
          >
            Login
          </SubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
    </form>
  );
};

export default Login;
