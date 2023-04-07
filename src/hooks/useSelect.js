import { useState } from "react";

const TYPES = {
  simple: "simple",
  creatable: "creatable",
  async: "async",
};

let Select;

export default function useSelect(type) {
  const [hasSelect, setHasSelect] = useState(false);

  if (TYPES[type] === TYPES.async) {
    import("@/components/molecules/Select/AsyncSelect")
      .then((Cmp) => {
        Select = Cmp.default;
      })
      .then(() => {
        setHasSelect(true);
      });
  } else if (TYPES[type] === TYPES.creatable) {
    import("@/components/molecules/Select/CreatableSelect")
      .then((Cmp) => {
        Select = Cmp.default;
      })
      .then(() => {
        setHasSelect(true);
      });
  } else {
    import("@/components/molecules/Select/Select")
      .then((Cmp) => {
        Select = Cmp.default;
      })
      .then(() => {
        setHasSelect(true);
      });
  }

  return [hasSelect, Select];
}
