import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/user-context";
import { useEffect, useState, type ReactNode } from "react";

import SendOTP from "@/components/forgot-password/send-otp";
import VerifyOTP from "@/components/forgot-password/verify-otp";
import ResetPassword from "@/components/forgot-password/reset-password";
import AllDone from "@/components/forgot-password/all-done";
import NotFound from "@/pages/error-pages/not-found";

import "./forgot-password.css";
import { Helmet } from "react-helmet-async";

export default function ForgotPassword(): ReactNode {
  const navigate = useNavigate();

  // if user is logged in, redirect to profile
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      navigate("/member/" + user._id, { replace: true });
    }
  }, [user, navigate]);

  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  switch (stage) {
    case 1:
      return (
        <ForgotPasswordPage>
          <SendOTP setEmail={setEmail} setStage={setStage} />
        </ForgotPasswordPage>
      );
    case 2:
      return (
        <ForgotPasswordPage>
          <VerifyOTP email={email} setToken={setToken} setStage={setStage} />
        </ForgotPasswordPage>
      );

    case 3:
      return (
        <ForgotPasswordPage>
          <ResetPassword email={email} token={token} setStage={setStage} />
        </ForgotPasswordPage>
      );
    case 4:
      return (
        <ForgotPasswordPage>
          <AllDone />
        </ForgotPasswordPage>
      );
    default:
      return (
        <ForgotPasswordPage>
          <NotFound />
        </ForgotPasswordPage>
      );
  }
}

function ForgotPasswordPage({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      {/* page meta data */}
      <Helmet>
        <title>MSCSC Forgot Password</title>
        <meta property="og:title" content="MSCSC Forgot Password" />
        <meta name="twitter:title" content="MSCSC Forgot Password" />
        <meta
          name="og:url"
          content={`https://mscsc.netlify.app/auth/forgot-password`}
        />
        <link
          rel="canonical"
          href={`https://mscsc.netlify.app/auth/forgot-password`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* page content */}
      {children}
    </>
  );
}
