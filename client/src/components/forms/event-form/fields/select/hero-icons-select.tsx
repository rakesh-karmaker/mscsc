import SelectIconField from "@/components/ui/select-icon-field";
import { icons } from "@/services/data/icons-data";
import { type ReactNode } from "react";
import type { Control } from "react-hook-form";

export default function HeroIconsSelect({
  control,
  errors,
  defaultValues,
}: {
  control: Control<any>;
  errors: { [key: string]: any };
  defaultValues: string[];
}): ReactNode {
  const defaultIcons: { [key: string]: string } = {
    icon1: defaultValues[0] || "division",
    icon2: defaultValues[1] || "rocket",
    icon3: defaultValues[2] || "chess",
    icon4: defaultValues[3] || "atom",
  };

  return (
    <div className="flex flex-col gap-2 min-w-1/4">
      {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => (
        <SelectIconField
          key={num}
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
