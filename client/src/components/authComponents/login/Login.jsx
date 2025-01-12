import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MemberLoginSchema } from "@/utils/MemberSchemaValidation";
import { loginUser } from "@/services/PostService";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast, { Toaster } from "react-hot-toast";
import filterError from "@/utils/FilterError";
import "./Login.css";

const Login = ({ setForm }) => {
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

  return (
    <form
      className="auth-form login-form"
      onSubmit={handleSubmit((data) => onSubmit(data, setError))}
    >
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
      <Toaster position="top-right" />
    </form>
  );
};

const onSubmit = async (data, setError) => {
  toast.promise(loginUser(data), {
    loading: "Logging in...",
    success: (res) => {
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

      return "Login Successful";
    },
    error: (err) => {
      if (err.status === 500) filterError(err);
      setError(err.response.data.subject, {
        message: err.response.data.message,
      });
      setError("root", {
        message: "Invalid Credentials",
      });
      return err.response.data.message;
    },
  });
};

export default Login;
