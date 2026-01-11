import type { ReactNode } from "react";
import { icons } from "@/services/data/icons-data";

type IconProps = {
  iconName: string;
};

export default function Icon({ iconName }: IconProps): ReactNode {
  return icons[iconName] || null;
}
