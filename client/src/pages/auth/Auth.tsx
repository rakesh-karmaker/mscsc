import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import FormHeading from "@/components/ui/formHeading/FromHeading";
import RegistrationForm from "@/components/forms/registrationForm/RegistrationForm";
import LoginForm from "@/components/forms/loginForm/LoginForm";

import "./auth.css";

export default function Auth({ method }: { method: "Login" | "Register" }) {
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
        <div
          className={`auth-container ${method.toLocaleLowerCase()}-container`}
        >
          <div>
            <FormHeading>{method}</FormHeading>
            {method === "Register" ? <RegistrationForm /> : <LoginForm />}
          </div>
        </div>
      </main>
    </>
  );
}
