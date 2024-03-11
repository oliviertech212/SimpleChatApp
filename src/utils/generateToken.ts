import jwt, { Secret } from "jsonwebtoken";

const generateToken = async (id: number) => {
  const secret: Secret = process.env.JWT_SECRET || "";
  try {
    return jwt.sign({ id }, secret, {
      expiresIn: "30d",
    });
  } catch (error: any) {
    throw new Error(error);
  }
};
export default generateToken;
