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
      timeField = true,
      errMessage,
    }: {
      value: Dayjs;
      onChange: (date: Dayjs | null) => void;
      label: string;
      timeField?: boolean;
      errMessage?: string;
    },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <div className="w-full h-full flex flex-col gap-2">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {window.innerWidth < 700 ? (
            <MobileDateTimePicker
              label={label}
              value={value}
              onChange={onChange}
              ref={ref}
              sx={{ width: "100%" }}
              viewRenderers={
                timeField
                  ? {}
                  : {
                      hours: null,
                      minutes: null,
                      seconds: null,
                    }
              }
            />
          ) : (
            <DesktopDateTimePicker
              label={label}
              value={value}
              onChange={onChange}
              ref={ref}
              sx={{ width: "100%" }}
              viewRenderers={
                timeField
                  ? {}
                  : {
                      hours: null,
                      minutes: null,
                      seconds: null,
                    }
              }
            />
          )}
        </LocalizationProvider>
        {errMessage && <p className="text-red-600 text-sm">{errMessage}</p>}
      </div>
    );
  },
);
