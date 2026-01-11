import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";

export const TimePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      label,
    }: {
      value: Dayjs;
      onChange: (date: Dayjs | null) => void;
      label: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {window.innerWidth < 700 ? (
          <MobileTimePicker
            label={label}
            value={value}
            onChange={onChange}
            ref={ref}
            sx={{ width: "100%" }}
          />
        ) : (
          <DesktopTimePicker
            label={label}
            value={value}
            onChange={onChange}
            ref={ref}
            sx={{ width: "100%" }}
          />
        )}
      </LocalizationProvider>
    );
  }
);
