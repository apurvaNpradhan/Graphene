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
export interface RouterAppContext {
   trpc: TRPCOptionsProxy<AppRouter>;
   queryClient: QueryClient;
   session: Awaited<ReturnType<typeof getSessionFn>>;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
   beforeLoad: async () => {
      try {
         const session = await getSessionFn();
         return session;
      } catch (error) {
         console.error("Failed to fetch session:", error);
         return null;
      }
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
