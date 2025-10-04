import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState, type ReactNode } from "react";

import SendOTP from "@/components/forgotPassword/SendOtp";
import VerifyOTP from "@/components/forgotPassword/VerifyOtp";
import ResetPassword from "@/components/forgotPassword/ResetPassword";
import AllDone from "@/components/forgotPassword/AllDone";
import NotFound from "@/pages/errorPages/NotFound";

import "./forgotPassword.css";

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
      return <SendOTP setEmail={setEmail} setStage={setStage} />;
    case 2:
      return (
        <VerifyOTP email={email} setToken={setToken} setStage={setStage} />
      );

    case 3:
      return <ResetPassword email={email} token={token} setStage={setStage} />;
    case 4:
      return <AllDone />;
    default:
      return <NotFound />;
  }
}
