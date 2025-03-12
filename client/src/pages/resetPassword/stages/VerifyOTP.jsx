import React, { useState } from "react";
import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest, verifyOtp } from "@/services/PostService";
import toast from "react-hot-toast";
import SubmitBtn from "@/components/UI/SubmitBtn";

const VerifyOTP = ({ email, setToken, setStage }) => {
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const tokenMutation = useMutation({
    mutationFn: (data) => verifyOtp(data.email, data.otp),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setError(null);
      setToken(res.data.token);
      setStage(3);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      setError(err.response.data.message);
    },
  });

  const handleChange = (e, index) => {
    const { value, maxLength } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field if the current one is filled
    if (value.length >= maxLength) {
      const nextInput = e.target.nextElementSibling;
      if (nextInput && nextInput.tagName === "INPUT") {
        nextInput.focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    if (paste.length === otp.length) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      // Move focus to the last input field
      e.target.form.elements[otp.length - 1].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    const otpNumber = otp.join("");

    tokenMutation.mutate({
      email,
      otp: otpNumber,
    });

    e.preventDefault();
  };

  const resend = async () => {
    setLoading(true);
    const res = await forgotPasswordRequest({ email });
    setLoading(false);
    if (res.status === 200) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <ForgotPasswordLayout
      title="Verify OTP"
      description={`We have sent an OTP to ${email}`}
      stage={2}
    >
      <form onSubmit={handleSubmit}>
        <div className="otp">
          <div className="otp-container">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                value={data}
                onChange={(e) => handleChange(e, index)}
                onPaste={index === 0 ? handlePaste : null} // Attach onPaste to the first input
                className="otp-input"
                maxLength={1}
              />
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <SubmitBtn
          isLoading={tokenMutation.isPending}
          pendingText="Verifying"
          width="100%"
        >
          Continue
        </SubmitBtn>

        <div className="resend">
          <p>Didn't receive the OTP?</p>
          <button type="button" onClick={resend} disabled={loading}>
            {loading ? "Sending..." : "Resend"}
          </button>
        </div>
      </form>
    </ForgotPasswordLayout>
  );
};

export default VerifyOTP;
