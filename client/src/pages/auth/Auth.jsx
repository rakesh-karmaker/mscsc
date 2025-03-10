import UserForm from "@/components/UserForm/UserForm";
import Login from "@/components/authComponents/login/Login";
import { useEffect, useRef } from "react";
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
      navigate(`/member/${user.slug}`, { replace: true });
    }
  }, [navigate, user]);

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (imgRef.current === null || containerRef.current === null) return;
    imgRef.current.style.height = `${containerRef.current.offsetHeight}px`;
  }, [imgRef, containerRef]);

  return (
    <>
      <main id="auth" ref={containerRef}>
        {window.innerWidth >= 1350 ? (
          <img
            src="/hero-img-1.webp"
            className="reg-img"
            alt="reg-img"
            ref={imgRef}
          />
        ) : null}
        <div
          className={`auth-container ${method.toLocaleLowerCase()}-container`}
        >
          <div>
            <FormHeading>{method}</FormHeading>
            {method === "Register" ? (
              <UserForm isRegister={true} schema={MemberRegSchema} />
            ) : (
              <Login />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Auth;
