import type { RegisterSchemaType } from "@/lib/validation/registerSchema";
import { Checkbox, FormControlLabel } from "@mui/material";
import type { ReactNode } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { NavLink } from "react-router-dom";

export default function Consent({
  register,
  errors,
}: {
  register: UseFormRegister<RegisterSchemaType>;
  errors: FieldErrors<RegisterSchemaType>;
}): ReactNode {
  return (
    <div className="consent">
      <FormControlLabel
        control={<Checkbox {...register("consent", { required: true })} />}
        label={
          <span>
            I agree to the{" "}
            <NavLink to="/terms-of-service">Terms of Service</NavLink> and{" "}
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>.
          </span>
        }
      />

      {errors.consent && (
        <p className="error-message">{errors.consent.message}</p>
      )}
    </div>
  );
}
