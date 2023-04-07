import { useState, useCallback, useEffect } from "react";

export const ACTIONS = {
  delete: "delete",
  edit: "edit",
};

const initialState = {
  id: null,
  index: null,
  action: null,
};

// reminder: this hook works assuming that
// you give it a ref to a parent element, usually tbody
// you have a unique id for each row, and that id is stored in the data-row-id attribute,
// you provide data-row-id to the tr element to specify the id of the row
// you provide data-action to button elements to specify the action to be performed

export default function useRowId(containerRef) {
  const [row, setRow] = useState(initialState);

  const handleRowClick = useCallback((e) => {
    const { action } = e.target.closest("button")?.dataset ?? { action: "" }; // if we click no btn
    const closestRow = e.target.closest("tr");

    if (ACTIONS[action] && closestRow) {
      const index = closestRow.rowIndex;
      const id = closestRow.getAttribute("data-row-id");
      setRow({ id, index, action });
    }
  }, []);

  const clearRowState = useCallback(() => {
    setRow(initialState);
  }, []);

  useEffect(() => {
    const currentNode = containerRef.current;

    if (containerRef.current) {
      currentNode.addEventListener("click", handleRowClick);
    }

    return () => {
      if (currentNode) {
        currentNode.removeEventListener("click", handleRowClick);
      }
    };
  }, [containerRef, handleRowClick]);

  return [row, clearRowState];
}
