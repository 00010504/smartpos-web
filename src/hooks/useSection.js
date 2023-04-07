import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 *
 * @returns {string} current page or section of the app, the specific url part is bound to a section
 * @example <caption>If the current url is `/products/catalog?limit=10&page=1`, then this hook returns Catalog as a section</caption>
 * @warning This hook relies on prototype augmented method: toCapitalCase which is added to the String prototype when we call initialize function
 * @requires Augmenting String prototype with toCapitalCase method
 * @see {@link src/helpers/initialize.js}
 */

export default function useSection() {
  const { pathname } = useLocation();
  const [section, setSection] = useState();

  useEffect(() => {
    const _section = pathname
      .split("/")
      .at(2)
      .replaceAll(/[- | _]/g, " ")
      .toCapitalCase();

    setSection(_section);
  }, [pathname]);

  return section;
}
