import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import type { Dayjs } from "dayjs";

export const DateTimePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      label,
    }: { value: Dayjs; onChange: (date: Dayjs | null) => void; label: string },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {window.innerWidth < 700 ? (
          <MobileDateTimePicker
            label={label}
            value={value}
            onChange={onChange}
            ref={ref}
            sx={{ width: "100%" }}
          />
        ) : (
          <DesktopDateTimePicker
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
