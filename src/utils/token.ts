import jwt from "jsonwebtoken";
export const signToken = (userId: string, role: string) => {
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new Error("JWT_SECRET is not defined");
    }
    const expiresIn = (process.env.JWT_EXPIRES_IN || "1h") as jwt.SignOptions["expiresIn"];
    return jwt.sign({ sub: userId, role }, secret, { expiresIn });
};
