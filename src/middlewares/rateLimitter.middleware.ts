import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
});
export const loginLimiter = rateLimit({
  windowMs: 15*60*1000,
  limit: 5,
})
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit:10,
})