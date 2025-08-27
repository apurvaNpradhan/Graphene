import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import type { Session } from "better-auth";
import { betterFetch } from "@better-fetch/fetch";

const getSessionFn = createServerFn({
   method: "GET",
}).handler(async () => {
   const { headers } = getWebRequest()!;
   const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
      baseURL: import.meta.env.VITE_SERVER_URL,
      headers: {
         cookie: headers.get("cookie") || "", // Forward the cookies from the request
      },
   });

   return session || null;
});

export { getSessionFn };
export type { Session };
