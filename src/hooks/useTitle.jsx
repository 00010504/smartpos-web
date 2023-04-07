import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function useTitle(routes) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    let tokens = pathname.split("/");
    tokens[0] = "/";
    tokens = tokens.filter((token) => token !== "");

    if (tokens[1] === "auth") {
      tokens = tokens.slice(1);
    }

    let title = tokens.reduce((acc, curr, index) => {
      const found =
        Array.isArray(acc) &&
        acc.find((route) => {
          if (route.path === curr) {
            return true;
          }

          if (route.path.split("/")[1]) {
            return (
              route.path.split("/")[0] === curr && index !== tokens.length - 1
            );
          }

          if (route.path.split(":")[1]) {
            return route.path.split(":")[0] === "";
          }

          return false;
        });

      if (found) {
        if (index === tokens.length - 1) {
          return found.title;
        }

        if (found.children) {
          return found.children;
        }

        return found.title;
      }

      return acc;
    }, routes);

    title = typeof title === "object" ? "Page not found" : title;

    document.title = t(title);
  }, [routes, pathname, t]);
}
