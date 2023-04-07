import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { useQuery } from "@tanstack/react-query";
import { getUserPermissionsQuery, getModulesQuery } from "@/queries";
import mapSectionToRules from "@/helpers/mapSectionToRules";
import { flatMap } from "lodash";

const _permissions = { sections: [] };
const _modules = { modules: [{ sections: [] }] };

export default function useRules() {
  const [userRules, setUserRules] = useState([]);
  const [allRules, setAllRules] = useState([]);

  const { isAuth } = useAuthContext();

  const { data: permissionsData } = useQuery({
    ...getUserPermissionsQuery(),
    enabled: isAuth,
    placeholderData: _permissions,
  });
  const { data: modulesData } = useQuery({
    ...getModulesQuery(),
    enabled: isAuth,
    placeholderData: _modules,
  });

  useEffect(() => {
    const _rules = flatMap(permissionsData.sections, mapSectionToRules);
    setUserRules(_rules);
  }, [permissionsData.sections]);

  useEffect(() => {
    const _allRules = flatMap(modulesData.modules, (module) =>
      flatMap(module.sections, mapSectionToRules),
    );
    setAllRules(_allRules);
  }, [modulesData.modules]);

  useEffect(() => {
    if (allRules.length && userRules.length) {
      logUniquePermissions(userRules);
      logNotGrantedPermissions(allRules, userRules);
      logSections(allRules);
    }
  }, [allRules, userRules]);

  return userRules; // return allRules if we want to have full access
}

function logUniquePermissions(rules) {
  const unique_perms = rules.reduce((set, rule) => {
    set.add(rule.action);
    return set;
  }, new Set());
  console.log("Unique permissions: ", unique_perms);
}

function logNotGrantedPermissions(allRules, userRules) {
  const allRulesArr = allRules.map((rule) => `${rule.subject}-${rule.action}`);
  const rulesArr = userRules.map((rule) => `${rule.subject}-${rule.action}`);
  const not_granted_perms = allRulesArr.filter(
    (rule) => !rulesArr.includes(rule),
  );
  console.log("Not granted permissions: ", not_granted_perms);
}

function logSections(rules) {
  const sections = rules.map((rule) => rule.subject);
  console.log("Sections: ", Array.from(new Set(sections)));
}
