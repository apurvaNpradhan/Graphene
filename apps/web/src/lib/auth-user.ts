import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

export const getAuthUser = createServerFn({ method: "GET" }).handler(async () => {
   const request = getWebRequest();
   if (!request?.headers) {
      return null;
   }
   const { data: session } = await authClient.getSession({
      fetchOptions: {
         headers: request.headers,
      },
   });
   return session?.user;
});
