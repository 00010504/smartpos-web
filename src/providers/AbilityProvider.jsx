import { useMemo } from "react";
import PropTypes from "prop-types";
import { abilityContext } from "@/contexts/abilityContext";
import useRules from "@/hooks/useRules";
import { createMongoAbility } from "@casl/ability";

export default function AbilityProvider({ children }) {
  const rules = useRules();

  const ability = useMemo(() => {
    if (rules.length) {
      return createMongoAbility(rules);
    }

    return null;
  }, [rules]);

  return (
    <abilityContext.Provider value={ability}>
      {children}
    </abilityContext.Provider>
  );
}

AbilityProvider.propTypes = {
  children: PropTypes.element.isRequired,
};
