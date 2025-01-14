import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberLoginSchema } from "@/utils/MemberSchemaValidation";
import { loginUser } from "@/services/PostService";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast, { Toaster } from "react-hot-toast";
import "./Login.css";
import { useMutation } from "@tanstack/react-query";
import useErrorNavigator from "@/hooks/useErrorNavigator";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Login = ({ setForm }) => {
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
    resolver: zodResolver(MemberLoginSchema),
  });

  const authMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      if (res.status === 200) {
        const token = res?.data?.token;
        localStorage.setItem("token", token);
        setUser(res?.data?.member);
        toast.success("Login successful!");
        const id = res?.data?.member?._id;
        // Ensure navigate is called after setting the token and user state
        setTimeout(() => {
          navigate(`/member/${id}`, { replace: true });
        }, 0);
        console.log("logged in");
      }
    },
    onError: (err) => {
      useErrorNavigator(true, err);
      setError(err.response.data.subject, {
        message: err.response.data.message,
      });
      setError("root", {
        message: "Invalid Credentials",
      });
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
            <p>Don't have an account?</p>
            <button onClick={() => setForm("Register")} type="button">
              Register Now
            </button>
          </div>
          <SubmitBtn
            isSubmitting={isSubmitting}
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
