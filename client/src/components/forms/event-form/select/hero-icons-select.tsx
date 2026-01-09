import { icons } from "@/services/data/icons-data";
import capitalize from "@/utils/capitalize";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState, type ReactNode } from "react";
import type { SetValueConfig } from "react-hook-form";

export default function HeroIconsSelect({
  setValue,
  getValues,
}: {
  setValue: (name: string, value: unknown, config?: SetValueConfig) => void;
  getValues: (payload?: string | string[]) => Object;
}): ReactNode {
  const [selectedHeroIcons, setSelectedHeroIcons] = useState<{
    [key: string]: string;
  }>({
    icon1: "division",
    icon2: "rocket",
    icon3: "chess",
    icon4: "atom",
  });

  return (
    <div className="flex flex-col gap-2 min-w-1/4">
      {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
        <FormControl
          fullWidth
          error={Boolean(getValues(`heroIcon${num}`) === "")}
        >
          <InputLabel id={`hero-icon-${num}`}>Icon {num}</InputLabel>
          <Select
            labelId={`hero-icon-${num}`}
            id={`hero-icon-${num}`}
            value={selectedHeroIcons[`icon${num}`]}
            onChange={(e) => {
              setSelectedHeroIcons((prev) => ({
                ...prev,
                [`icon${num}`]: e.target.value,
              }));
              setValue(`heroIcon${num}`, e.target.value);
            }}
            label={`Icon ${num}`}
          >
            {Object.keys(icons).map((iconName) => (
              <MenuItem key={`hero-${num}-${iconName}`} value={iconName}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {icons[iconName]}
                  {capitalize(iconName)}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </div>
  );
}
