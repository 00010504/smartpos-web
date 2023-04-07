import { useAbilityContext } from "@/contexts/abilityContext";
import useSection from "./useSection";

/**
 * Hides collection items that a user has no permission to see in  a current section or pathname
 * @param {{collection: [], permission: "", accessorKey: "", match: ""}} config consists of `collection` - an array of data containers, `permission` - permission to check, `accessorKey` - if a data container item is an object we need a key to access the correct property, `match` - a value we need to check against to filter that item out
 * @returns {[]} filtered data
 * @see ProductsTable.jsx
 */
export default function useHideData(config) {
  const { collection, permission, accessorKey, match } = config;

  const section = useSection();
  const ability = useAbilityContext();

  const shouldShow = ability.can(permission, section);

  return collection.map((arr) => {
    return arr.filter((item) => {
      if (typeof item === "string") {
        return item === match ? shouldShow : true;
      }
      return item[accessorKey] === match ? shouldShow : true;
    });
  });
}
