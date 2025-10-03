import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

import SendOTP from "./stages/SendOTP";

import "./ForgotPassword.css";
import VerifyOTP from "./stages/VerifyOTP";
import ResetPassword from "./stages/ResetPassword";
import AllDone from "./stages/AddDone";
import NotFound from "@/pages/Errors/NotFound";

const ForgotPassword = () => {
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
};

export default ForgotPassword;
