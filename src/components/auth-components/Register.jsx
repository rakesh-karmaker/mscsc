import { MemberRegSchema } from "@/utils/MemberSchemaValidation";
import { registerUser } from "@/services/PostServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { YearRadio, BranchRadio } from "@/components/UI/RegRadios";
import FileInput from "@/components/UI/FileInput/FileInput";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import toast, { Toaster } from "react-hot-toast";

const Register = ({ setForm }) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(MemberRegSchema),
  });

  const onSubmit = async (data) => {
    toast.promise(registerUser(data), {
      loading: "Registering...",
      success: (res) => {
        if (res.status === 201) {
          setTimeout(location.reload(), 7000);
        }
        return "Registered Successfully";
      },
      error: (err) => {
        if (err.status === 400) {
          setError(err.response.data.subject, {
            message: err.response.data.message,
          });
          setError("root", {
            message: "Invalid Credentials",
          });
          console.log(err.response.data.message);
        }
        return err.response.data.message;
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <div className="combined-inputs">
        <InputText register={register("name")} errors={errors.name}>
          Full Name
        </InputText>
        <InputText register={register("email")} errors={errors.email}>
          Email
        </InputText>
      </div>

      <div className="combined-inputs">
        <InputText
          register={register("password")}
          errors={errors.password}
          type="password"
        >
          Password
        </InputText>
        <InputText
          register={register("contactNumber")}
          errors={errors.contactNumber}
          type="number"
        >
          Phone Number
        </InputText>
      </div>

      <YearRadio register={register} errors={errors} />

      <BranchRadio register={register} errors={errors} />

      <FileInput register={register("image")} errors={errors.image}>
        Give us your formal photo:
      </FileInput>

      <InputText register={register("reason")} errors={errors.reason}>
        Why do you want to Join the club?
      </InputText>

      <div className="combined-inputs">
        <InputText register={register("socialLink")} errors={errors.socialLink}>
          Social Link
        </InputText>
        <InputText register={register("reference")} errors={errors.reference}>
          Reference
        </InputText>
      </div>

      <div>
        <div className="submission">
          <div className="state-redirect">
            <p>Already have an account?</p>
            <button onClick={() => setForm("Login")} type="button">
              Login Now
            </button>
          </div>
          <SubmitBtn
            isSubmitting={isSubmitting}
            errors={errors}
            pendingText="Registering"
          >
            Register as a Member
          </SubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
      <Toaster position="top-right" />
    </form>
  );
};

export default Register;
