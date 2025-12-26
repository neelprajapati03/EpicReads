import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

interface MyRouterContext {
  queryClient: QueryClient;
}


const rootRoute = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return (
      <>
        <Outlet />
      </>
    );
  },
});

export const queryClient = new QueryClient();