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

  const leftRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (leftRef.current === null || containerRef.current === null) return;
    leftRef.current.style.minHeight = `${containerRef.current.offsetHeight}px`;
  }, [leftRef, containerRef]);

  return (
    <>
      <main id="auth" ref={containerRef}>
        {window.innerWidth >= 1350 ? (
          <>
            {/* <img
            src="/squries.png"
            className="reg-img"
            alt="reg-img"
            ref={imgRef}
          /> */}
            <AuthLeft leftRef={leftRef} />
          </>
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

const AuthLeft = ({ leftRef }) => {
  return (
    <div className="auth-left" ref={leftRef}>
      <div className="auth-left-container">
        <p>Hello there</p>
      </div>
      <div className="slash">
        <svg preserveAspectRatio="xMaxYMin meet">
          <g transform="skewX(167.6)">
            <rect x="0" y="0" height="100%" width="100%"></rect>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Auth;
