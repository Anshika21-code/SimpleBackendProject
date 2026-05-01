import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  console.log("Generating token for:", user._id);  

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
  
};