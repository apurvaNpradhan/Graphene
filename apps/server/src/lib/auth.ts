import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as schema from "../db/schema/auth.js";
import { reactStartCookies } from "better-auth/react-start";

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: "pg",

      schema: schema,
   }),
   trustedOrigins: [process.env.CORS_ORIGIN || ""],
   emailAndPassword: {
      enabled: true,
   },
   plugins: [reactStartCookies()],
   advanced: {
      defaultCookieAttributes: {
         sameSite: "none",
         secure: true,
         httpOnly: true,
      },
   },
});
