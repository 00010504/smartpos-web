import { useMemo } from "react";
import { createBrowserRouter } from "react-router-dom";
import staticRoutes from "@/routes/routes";
// import { useAbilityContext } from "@/contexts/abilityContext";
// import { SEE } from "@/constants/permissions";
// import { cloneDeep, isEmpty } from "lodash";
// import useSections from "./useSections";

export default function useDynamicRouter() {
  // const sections = useSections();
  // const ability = useAbilityContext();

  const router = useMemo(() => {
    // if (ability && !isEmpty(sections)) {
    //   // console.log(ability.can(SEE, "New Sales"));
    //   // console.log(ability, routes, sections);
    //   const _routes = cloneDeep(staticRoutes);
    //   _routes[0].children = _routes[0].children.map((route) => {
    //     if (route.children) {
    //       return route.children.filter((section) => {
    //         console.log(
    //           ability.can(
    //             SEE,
    //             sections[section.id.replace("-", " ").toCapitalCase()],
    //           ),
    //         );
    //         return ability.can(
    //           SEE,
    //           sections[section.id.replace("-", " ").toCapitalCase()],
    //         );
    //       });
    //     }
    //     return route;
    //   });

    //   return createBrowserRouter(_routes);
    // }

    return createBrowserRouter(staticRoutes);
  }, []);

  // console.log(ability);

  return router;
}
