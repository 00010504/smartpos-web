import { createContext, useContext } from "react";

const abilityContext = createContext();
const abilityConsumer = abilityContext.Consumer;

export { abilityContext, abilityConsumer, useAbilityContext };

function useAbilityContext() {
  return useContext(abilityContext);
}
