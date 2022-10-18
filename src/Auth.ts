import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET !;

export function getToken(id : number) {
    return jwt.sign({
        id: id
    }, SECRET, {expiresIn: "7 days"});
}

export function hash(password : string) {
    return bcrypt.hashSync(password, 12);
}

export function generateToken(id: number) {
  return jwt.sign({ id }, SECRET);
}
