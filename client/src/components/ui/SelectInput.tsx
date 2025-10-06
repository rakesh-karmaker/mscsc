import type { EditUserSchemaType } from "@/lib/validation/editUserSchema";
import type { MemberEditSchema } from "@/lib/validation/memberEditSchema";
import type { RegisterSchemaType } from "@/lib/validation/registerSchema";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type SelectInputProps<
  T extends RegisterSchemaType | EditUserSchemaType | MemberEditSchema
> = {
  control: Control<T>;
  name: keyof T;
  errors: FieldErrors<T>;
  dataList: { label: string; value: string }[];
  children: React.ReactNode;
};

export default function SelectInput<
  T extends RegisterSchemaType | EditUserSchemaType | MemberEditSchema
>({ control, name, errors, dataList, children }: SelectInputProps<T>) {
  return (
    <FormControl fullWidth error={!!errors[name as keyof T]?.message}>
      <InputLabel id={"select" + children}>{children}</InputLabel>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <Select
            labelId={"select" + children}
            id={"select-id" + children}
            label={children}
            {...field}
          >
            {dataList.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors[name]?.message && (
        <p style={{ color: "red" }}>{String(errors[name]?.message)}</p>
      )}
    </FormControl>
  );
}
