import type { EditUserSchemaType } from "@/lib/validation/editUserSchema";
import { Checkbox, FormControlLabel } from "@mui/material";
import type { ReactNode } from "react";
import type { UseFormRegister } from "react-hook-form";

export default function HideImage({
  register,
  isHidden,
}: {
  register: UseFormRegister<EditUserSchemaType>;
  isHidden: boolean;
}): ReactNode {
  return (
    <FormControlLabel
      control={
        <Checkbox {...register("hideImage")} defaultChecked={isHidden} />
      }
      label={<span>Hide image</span>}
    />
  );
}
