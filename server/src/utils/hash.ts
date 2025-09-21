import bcrypt from "bcryptjs";

export async function generateHash(text: string): Promise<string> {
  const saltRounds = 10;
  const hash = await bcrypt.hash(text, saltRounds);
  return hash;
}

export async function compareHash(
  text: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(text, hash);
}
