import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

export const DatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      label,
      errMessage,
    }: {
      value: Dayjs;
      onChange: (date: Dayjs | null) => void;
      label: string;
      errMessage?: string;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div className="w-full h-full flex flex-col gap-2">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {window.innerWidth < 700 ? (
            <MobileDatePicker
              label={label}
              value={value}
              onChange={onChange}
              ref={ref}
              sx={{ width: "100%" }}
            />
          ) : (
            <DesktopDatePicker
              label={label}
              value={value}
              onChange={onChange}
              ref={ref}
              sx={{ width: "100%" }}
            />
          )}
        </LocalizationProvider>
        {errMessage && <p className="text-red-600 text-sm">{errMessage}</p>}
      </div>
    );
  },
);
