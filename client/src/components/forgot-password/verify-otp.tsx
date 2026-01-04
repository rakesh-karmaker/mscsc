import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import ForgotPasswordLayout from "@/layouts/forgot-password-layout";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { forgotPasswordRequest, verifyOtp } from "@/lib/api/forgot-password";
import type { AxiosError } from "axios";
import FormSubmitBtn from "../ui/form-submit-btn";

export default function VerifyOTP({
  email,
  setToken,
  setStage,
}: {
  email: string;
  setToken: Dispatch<SetStateAction<string>>;
  setStage: Dispatch<SetStateAction<number>>;
}): ReactNode {
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const tokenMutation = useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      verifyOtp(data.email, data.otp),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setError("");
      setToken(res.data.token);
      setStage(3);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data.message || "OTP verification failed");
      setError(err.response?.data.message || "OTP verification failed");
    },
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value, maxLength } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field if the current one is filled
    if (value.length >= maxLength) {
      const nextInput = e.target.nextElementSibling;
      if (nextInput && nextInput.tagName === "INPUT") {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handlePaste = (e: React.FormEvent<ClipboardEvent>) => {
    const paste =
      (e as unknown as ClipboardEvent).clipboardData?.getData("text") || "";
    if (paste.length === otp.length) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      // Move focus to the last input field
      (
        (e.target as HTMLInputElement).form?.elements[
          otp.length - 1
        ] as HTMLInputElement
      ).focus();
    }
    e.preventDefault();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const otpNumber = otp.join("");

    tokenMutation.mutate({
      email,
      otp: otpNumber,
    });

    e.preventDefault();
  };

  const resend = async () => {
    setLoading(true);
    const res = await forgotPasswordRequest(email);
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
                onPaste={
                  index === 0
                    ? (e: React.ClipboardEvent<HTMLInputElement>) =>
                        handlePaste(
                          e as unknown as React.FormEvent<ClipboardEvent>
                        )
                    : undefined
                } // Attach onPaste to the first input
                className="otp-input"
                maxLength={1}
              />
            ))}
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>

        <FormSubmitBtn isLoading={loading} pendingText="Verifying" width="100%">
          Continue
        </FormSubmitBtn>

        <div className="resend">
          <p>Didn&apos;t receive the OTP?</p>
          <button type="button" onClick={resend} disabled={loading}>
            {loading ? "Sending..." : "Resend"}
          </button>
        </div>
      </form>
    </ForgotPasswordLayout>
  );
}
