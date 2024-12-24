import {
  MemberRegSchema,
  MemberProfileEditSchema,
} from "@/utils/MemberSchemaValidation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { YearRadio, BranchRadio } from "@/components/UI/RegRadios";
import FileInput from "@/components/UI/FileInput/FileInput";
import InputText from "@/components/UI/InputText/InputText";
import SubmitBtn from "@/components/UI/SubmitBtn";
import { Toaster } from "react-hot-toast";
import registerToast from "@/components/auth-components/registerToast";
import editProfileToast from "@/components/profile-components/editProfileToast";
import "./UserForm.css";

const UserForm = (props) => {
  const defaultData = props?.data && {
    name: props.data.name,
    email: props.data.email,
    password: "",
    contactNumber: props.data.contactNumber,
    branch: props.data.branch,
    reason: props.data.reason,
    socialLink: props.data.socialLink,
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      props?.setForm ? MemberRegSchema : MemberProfileEditSchema
    ),
    defaultValues: defaultData,
  });

  const onSubmit = async (data) => {
    if (props.setForm) {
      registerToast(data, setError);
    } else {
      editProfileToast(data, setError);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
      <div className="combined-inputs">
        <InputText register={register("name")} errors={errors.name} id="name">
          Full Name
        </InputText>
        {props?.setForm && (
          <InputText
            register={register("email")}
            errors={errors.email}
            id="email"
          >
            Email
          </InputText>
        )}
      </div>

      <div className="combined-inputs">
        <InputText
          register={register("password")}
          errors={errors.password}
          type="password"
          id="password"
          required={props?.setForm ?? false}
        >
          {props?.setForm ? "Password" : "New Password"}
        </InputText>
        <InputText
          register={register("contactNumber")}
          errors={errors.contactNumber}
          type="number"
          id="contactNumber"
        >
          Phone Number
        </InputText>
      </div>

      {props?.setForm && <YearRadio register={register} errors={errors} />}

      <BranchRadio register={register} errors={errors} />

      {props?.setForm && (
        <FileInput register={register("image")} errors={errors.image}>
          Give us your formal photo:
        </FileInput>
      )}

      <InputText
        register={register("reason")}
        errors={errors.reason}
        id="reason"
      >
        Why do you want to Join the club?
      </InputText>

      <div className="combined-inputs">
        <InputText
          register={register("socialLink")}
          errors={errors.socialLink}
          id="socialLink"
        >
          Facebook Link
        </InputText>

        {props?.setForm && (
          <InputText
            register={register("reference")}
            errors={errors.reference}
            id="reference"
          >
            Reference
          </InputText>
        )}
      </div>
      <div>
        <div className="submission">
          {props?.setForm ? (
            <div className="state-redirect">
              <p>Already have an account?</p>
              <button onClick={() => props.setForm("Login")} type="button">
                Login Now
              </button>
            </div>
          ) : null}
          <SubmitBtn
            isSubmitting={isSubmitting}
            errors={errors}
            pendingText={props?.setForm ? "Registering..." : "Updating..."}
          >
            {props?.setForm ? "Register as a Member" : "Update"}
          </SubmitBtn>
        </div>
        {errors.root && <p className="error-message">{errors.root.message}</p>}
      </div>
      <Toaster position="top-right" />
    </form>
  );
};

export default UserForm;
