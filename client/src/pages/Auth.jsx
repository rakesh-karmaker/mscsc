import UserForm from "@/components/UI/UserForm/UserForm";
import Login from "@/components/auth-components/Login";
import RegisterImage from "@/components/auth-components/RegisterImage";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/Contexts/UserContext";
import { MemberRegSchema } from "@/utils/MemberSchemaValidation";

import "@/components/auth-components/Auth.css";

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
    <main id="auth">
      {window.innerWidth >= 1080 ? (
        <RegisterImage registerFormContainer={registerFormContainer} />
      ) : null}

      <div ref={registerFormContainer} className="auth-container">
        <h1>{form}</h1>
        {form === "Register" ? (
          <UserForm setForm={setForm} schema={MemberRegSchema} />
        ) : (
          <Login setForm={setForm} />
        )}
      </div>
    </main>
  );
};

export default Auth;
