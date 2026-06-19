import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";

const app = new Elysia()
  .get("/", () => ({ message: "Hello from Elysia and Bun!" }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return allUsers;
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .post("/users", async ({ body }) => {
    const { name, email } = body as { name: string; email: string };
    try {
      await db.insert(users).values({ name, email });
      return { success: true };
    } catch (error: any) {
      return { error: error.message };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
