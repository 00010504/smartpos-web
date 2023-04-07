import { matchRoutes, useLocation } from "react-router-dom";
import specialRoutes from "@/routes/specialRoutes";

export default function useRouteLayout() {
  const { pathname } = useLocation();
  const match = matchRoutes(specialRoutes, pathname);
  // match can be null, array of objects or object
  if (match) {
    return {
      isSpecial: true,
      removeSidebar: match[0].route.removeSidebar,
      removeHeader: match[0].route.removeHeader,
    };
  }

  return {
    isSpecial: false,
  };
}
