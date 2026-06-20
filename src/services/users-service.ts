import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const registerUser = async (data: any) => {
  const { name, email, password } = data;

  // Check if email already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Insert user
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};
