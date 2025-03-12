import UserForm from "@/components/UserForm/UserForm";
import Login from "@/components/authComponents/login/Login";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { MemberRegSchema } from "@/utils/MemberSchemaValidation";
import FormHeading from "@/components/UI/FormHeading/FormHeading";

import "./Auth.css";

const Auth = ({ method }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    if (user !== null) {
      navigate(`/member/${user.slug}`, { replace: true });
    }
  }, [navigate, user]);

  return (
    <>
      <main id="auth">
        <AuthLeft />
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

const AuthLeft = () => {
  return (
    <div className="auth-left">
      <div className="auth-left-container">
        <p className="auth-text">
          Start learning <br />
          <span>
            with <span className="highlighted-text">MSCSC</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
