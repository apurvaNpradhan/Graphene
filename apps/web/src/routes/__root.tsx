import { Toaster } from "@/components/ui/sonner";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
   HeadContent,
   Outlet,
   Scripts,
   createRootRouteWithContext,
   redirect,
   useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/header";
import appCss from "../index.css?url";
import type { QueryClient } from "@tanstack/react-query";
import Loader from "@/components/loader";

import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../../server/src/routers";
import { getSessionFn } from "@/lib/auth-session";
import { getAuthUser } from "@/lib/auth-user";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { authClient } from "@/lib/auth-client";
export interface RouterAppContext {
   trpc: TRPCOptionsProxy<AppRouter>;
   queryClient: QueryClient;
   user: Awaited<ReturnType<typeof getUser>>;
}
const getUser = createServerFn({ method: "GET" }).handler(async () => {
   const { headers } = getWebRequest()!;
   const session = await authClient.getSession({
      fetchOptions: {
         headers,
      },
   });
   return session.data?.user || null;
});

export const Route = createRootRouteWithContext<RouterAppContext>()({
   beforeLoad: async ({ context }) => {
      const user = await context.queryClient.fetchQuery({
         queryKey: ["user"],
         queryFn: ({ signal }) => getUser({ signal }),
      });
      return { user };
   },
   head: () => ({
      meta: [
         {
            charSet: "utf-8",
         },
         {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
         },
         {
            title: "My App",
         },
      ],
      links: [
         {
            rel: "stylesheet",
            href: appCss,
         },
      ],
   }),

   component: RootDocument,
});

function RootDocument() {
   const isFetching = useRouterState({ select: (s) => s.isLoading });

   return (
      <html lang="en" className="dark">
         <head>
            <HeadContent />
         </head>
         <body>
            <div className="grid h-svh grid-rows-[auto_1fr]">
               <Header />
               {isFetching ? <Loader /> : <Outlet />}
            </div>
            <Toaster richColors />
            <TanStackRouterDevtools position="bottom-left" />
            <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
            <Scripts />
         </body>
      </html>
   );
}
