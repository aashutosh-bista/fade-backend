import bcrypt from "bcryptjs";
const SALT_ROUNDS = 10;
export async function passwordHasher(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);
