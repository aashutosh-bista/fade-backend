import type { SignUpInput, LoginInput } from "../validators/auth.validator.js";
import { signToken } from "../utils/token.js";
import { User } from "../models/user.model.js";
import { comparePassword, DUMMY_HASH, passwordHasher } from "../utils/password.js";
import { ApiError } from "../utils/apiError.js";

const toSafeUser = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const signUpService = async (data: SignUpInput) => {
  const hashedPassword = await passwordHasher(data.password);
  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash: hashedPassword,
  });
  return toSafeUser(user);
};

export const loginService = async (data: LoginInput) => {
  const user = await User.findOne({ email: data.email }).select(
    "+passwordHash",
  );
  const isMatch = await comparePassword(
    data.password,
    user?.passwordHash ?? DUMMY_HASH,
  );
  if (!user || !isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }
  if (!user || !isMatch || user.role !== "admin") {
  throw new ApiError(401, "Invalid credentials");
}
  const token = signToken(user.id, user.role);
  return { token, user: toSafeUser(user) };
};
