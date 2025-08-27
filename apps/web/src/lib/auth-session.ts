import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";
import type { Session } from "better-auth";

const getSessionFn = createServerFn({
   method: "GET",
}).handler(async () => {
   const { headers } = getWebRequest()!;

   const session = await authClient.getSession({
      fetchOptions: {
         headers,
      },
   });
   return session.data || null;
});

export { getSessionFn };
export type { Session };
