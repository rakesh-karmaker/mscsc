import { icons as icon } from "@/services/data/icons-data";
import capitalize from "@/utils/capitalize";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { ReactNode } from "react";
import { Controller, type Control } from "react-hook-form";

type SelectIconFieldProps = {
  hasErrors: boolean;
  id: string;
  name: string;
  icons: { [iconName: string]: ReactNode };
  control: Control<any>;
  errorMessage: string;
  defaultValue: string;
  children: ReactNode;
};

export default function SelectIconField({
  hasErrors,
  id,
  name,
  icons,
  control,
  errorMessage,
  defaultValue = "",
  children,
}: SelectIconFieldProps): ReactNode {
  return (
    <div className="w-full flex flex-col gap-2">
      <FormControl fullWidth error={hasErrors}>
        <InputLabel id={id}>{children}</InputLabel>
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Select {...field} labelId={id} id={id} label={children}>
              {Object.keys(icons).map((iconName) => (
                <MenuItem key={`${name}-${id}-${iconName}`} value={iconName}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {icon[iconName]}
                    {capitalize(iconName)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
      {hasErrors && <p className="text-red-600 text-sm">{errorMessage}</p>}
    </div>
  );
}
