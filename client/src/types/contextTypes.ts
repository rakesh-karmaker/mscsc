import type { User } from "./userTypes";

export type UserContextType = {
  user: User | null;
  isVerifying: boolean;
};
