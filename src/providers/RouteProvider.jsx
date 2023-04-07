import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import useDynamicRouter from "@/hooks/useDynamicRouter";
import FullscreenSpinner from "@/components/atoms/FullscreenSpinner";

export default function RouteProvider() {
  const router = useDynamicRouter();

  return (
    <Suspense fallback={<FullscreenSpinner h="100vh" />}>
      <RouterProvider
        router={router}
        fallbackElement={<FullscreenSpinner h="100vh" display="none" />}
      />
    </Suspense>
  );
}
