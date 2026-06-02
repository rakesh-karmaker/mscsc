import { v4 as uuidv4 } from "uuid";

export default function generateUID(): string {
  return uuidv4();
}
