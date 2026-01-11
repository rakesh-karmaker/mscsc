import SelectIconField from "@/components/ui/select-icon-field";
import { icons } from "@/services/data/icons-data";
import { type ReactNode } from "react";
import type { Control } from "react-hook-form";

export default function HeroIconsSelect({
  control,
  errors,
}: {
  control: Control<any>;
  errors: { [key: string]: any };
}): ReactNode {
  const defaultIcons: { [key: string]: string } = {
    icon1: "division",
    icon2: "rocket",
    icon3: "chess",
    icon4: "atom",
  };

  return (
    <div className="flex flex-col gap-2 min-w-1/4">
      {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
        <SelectIconField
          id={`hero-icon-select-${num}`}
          name={`heroIcon${num}`}
          icons={icons}
          control={control}
          hasErrors={Boolean(errors[`heroIcon${num}`])}
          errorMessage={errors[`heroIcon${num}`]?.message as string}
          defaultValue={defaultIcons[`icon${num}`]}
        >
          Icon {num}
        </SelectIconField>
      ))}
    </div>
  );
}
