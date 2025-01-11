import UserForm from "@/components/UserForm/UserForm";
import Login from "@/components/auth-components/login/Login";
import RegisterImage from "@/components/auth-components/RegisterImage";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/Contexts/UserContext";
import { MemberRegSchema } from "@/utils/MemberSchemaValidation";

import "./Auth.css";
import FormHeading from "@/components/UI/FormHeading/FormHeading";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    if (user !== null) {
      navigate("/", { replace: true });
    }
  }, [navigate, user]);

  const registerFormContainer = useRef(null);
  const [form, setForm] = useState("Register");

  return (
    <>
      <main id="auth">
        {window.innerWidth >= 1080 && form === "Register" ? (
          <RegisterImage registerFormContainer={registerFormContainer} />
        ) : null}
        <div
          ref={registerFormContainer}
          className={`auth-container ${form.toLocaleLowerCase()}-container`}
        >
          <FormHeading>{form}</FormHeading>
          {form === "Register" ? (
            <UserForm setForm={setForm} schema={MemberRegSchema} />
          ) : (
            <Login setForm={setForm} />
          )}
        </div>
      </main>
    </>
  );
};

export default Auth;
