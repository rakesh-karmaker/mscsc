import React, { useState } from "react";
import ForgotPasswordLayout from "@/layouts/ForgotPasswordLayout";

const VerifyOTP = ({ email }) => {
  const [otp, setOtp] = useState(new Array(5).fill(""));

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
    console.log(otp.join(""));
    e.preventDefault();
  };

  return (
    <ForgotPasswordLayout
      title="Verify OTP"
      description={"We have sent an OTP to " + email}
      image={"/password.png"}
    >
      <form onSubmit={handleSubmit}>
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
        <button className="primary-button" type="submit">
          Continue
        </button>
      </form>
    </ForgotPasswordLayout>
  );
};

export default VerifyOTP;
