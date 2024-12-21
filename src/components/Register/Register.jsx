import MemberSchema from "../../utils/MemberSchemaValidation";
import { registerUser } from "../../services/PostServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RadioList from "../UI/RadioList/RadioList";
import FileInput from "../UI/FileInput/FileInput";
import InputText from "../UI/InputText/InputText";
import RegisterImage from "./RegisterImage";
import { useRef } from "react";

import "./Register.css";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(MemberSchema),
  });

  const date = new Date();
  const currentYear = date.getFullYear();
  const years = [];
  for (let i = 1; i <= 5; i++) {
    years.push(currentYear + i);
  }

  const branches = [
    "Branch - 1",
    "Branch - 2",
    "Branch - 3",
    "Main Boys",
    "Main Girls",
  ];

  const registerForm = useRef(null);

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main id="register">
      {window.innerWidth >= 1080 ? (
        <RegisterImage registerForm={registerForm} />
      ) : null}
      <div ref={registerForm} className="register-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <InputText register={register("name")} errors={errors.name}>
            Full Name
          </InputText>
          <div className="combined-inputs">
            <InputText
              register={register("email")}
              errors={errors.email}
              type="email"
            >
              Email
            </InputText>
            <InputText
              register={register("contactNumber")}
              errors={errors.contactNumber}
              type="number"
            >
              Phone Number
            </InputText>
          </div>
          <RadioList
            register={register("batch")}
            errors={errors.batch}
            dataList={years}
          >
            SSC Batch:
          </RadioList>
          <RadioList
            register={register("branch")}
            errors={errors.branch}
            dataList={branches}
          >
            School Branch:
          </RadioList>
          <FileInput register={register("image")} errors={errors.image}>
            Give us your formal photo:
          </FileInput>
          {errors.image && (
            <p className="error-message">{errors.image.message}</p>
          )}
          <InputText register={register("reason")} errors={errors.reason}>
            Why do you want to Join the club?
          </InputText>
          <div className="combined-inputs">
            <InputText
              register={register("socialLink")}
              errors={errors.socialLink}
              type="url"
            >
              Social Link
            </InputText>
            <InputText
              register={register("reference")}
              errors={errors.reference}
            >
              Reference
            </InputText>
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="primary-button"
            style={{ width: "fit-content" }}
          >
            {isSubmitting ? "Registering..." : "Register as a Member"}
          </button>
          {errors.root && <p>{errors.root.message}</p>}
        </form>
      </div>
    </main>
  );
};

export default Register;
