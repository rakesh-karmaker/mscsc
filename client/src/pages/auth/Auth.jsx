import UserForm from "@/components/UserForm/UserForm";
import Login from "@/components/authComponents/login/Login";
import RegisterImage from "@/components/authComponents/RegisterImage";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { MemberRegSchema } from "@/utils/MemberSchemaValidation";

import "./Auth.css";
import FormHeading from "@/components/UI/FormHeading/FormHeading";

const Auth = ({ method }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    if (user !== null) {
      navigate(`/member/${user._id}`, { replace: true });
    }
  }, [navigate, user]);

  const registerFormContainer = useRef(null);

  return (
    <>
      <main id="auth">
        {window.innerWidth >= 1200 && method === "Register" ? (
          <RegisterImage registerFormContainer={registerFormContainer} />
        ) : null}
        <div
          ref={registerFormContainer}
          className={`auth-container ${method.toLocaleLowerCase()}-container`}
        >
          <FormHeading>{method}</FormHeading>
          {method === "Register" ? (
            <UserForm isRegister={true} schema={MemberRegSchema} />
          ) : (
            <Login />
          )}
        </div>
      </main>
    </>
  );
};

export default Auth;
