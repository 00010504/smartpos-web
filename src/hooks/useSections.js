import { useAuthContext } from "@/contexts/authContext";
import { getModulesQuery } from "@/queries";
import { useQuery } from "@tanstack/react-query";

const _modules = { modules: [{ sections: [] }] };

export default function useSections() {
  const { isAuth } = useAuthContext();

  const { data: modulesData } = useQuery({
    ...getModulesQuery(),
    enabled: isAuth,
    placeholderData: _modules,
  });

  return modulesData.modules
    .flatMap((module) => module.sections.flatMap((section) => section.name))
    .reduce((hashMap, sectionName) => {
      return { ...hashMap, [sectionName]: sectionName };
    }, {});
}
