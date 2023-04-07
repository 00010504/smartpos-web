/* eslint-disable no-param-reassign */
import { cloneDeep, once } from "lodash";
import LocalStorage from "@/utils/LocalStorage";

export const reducer = (itemsState, { type, payload }) => {
  let itemsClone = cloneDeep(itemsState);
  const { index, source, destination } = payload;

  if (type === ACTIONS.click) {
    const toggledState = !itemsClone[index].isActive;

    itemsClone.forEach((item) => {
      item.isActive = false;
    });

    itemsClone[index].isActive = toggledState;

    return itemsClone;
  }

  if (type === ACTIONS.activate) {
    itemsClone.forEach((item) => {
      item.isActive = false;
    });

    itemsClone[index].isActive = true;

    return itemsClone;
  }

  if (type === ACTIONS.reorder) {
    itemsClone = reorder(itemsClone, { source, destination });
    return itemsClone;
  }

  return itemsState;
};

export const VARIANTS = {
  open: { width: "240px" },
  closed: { width: "65px" },
};

export const ACTIONS = {
  click: "click",
  reorder: "reorder",
  activate: "activate",
};

const grid = 8;

export const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  // userSelect: "none",
  // padding: grid * 2,
  // margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  // background: isDragging ? "e5edfe" : "inherit",

  // styles we need to apply on draggables
  ...draggableStyle,
});

export const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

export const reorder = (target, { source, destination }) => {
  if (!destination) {
    return target;
  }

  if (source.index === destination.index) {
    return target;
  }

  if (Array.isArray(target)) {
    const [...result] = target;

    const [removed] = result.splice(source.index, 1);
    result.splice(destination.index, 0, removed);

    return result;
  }

  return target;
};

const normalize = (items) => {
  const itemsClone = cloneDeep(items).filter(
    (item) => item.children.length > 0,
  );

  itemsClone.forEach((item, index) => {
    item.isActive = false;
    item.initialIndex = index;
  });

  if (LocalStorage.sidebar) {
    return fromLocalStorage(itemsClone);
  }

  return itemsClone;
};

export const initialize = once(normalize);

export const toLocalStorage = (items) => {
  return items.map(({ id, initialIndex }) => ({ id, initialIndex }));
};

const fromLocalStorage = (items) => {
  const { items: ls_items } = LocalStorage.sidebar;

  return ls_items.map(({ initialIndex }) => items[initialIndex]);
};

export const findParentIndex = (child, items) => {
  let foundIndex = -1;

  items.forEach((item, parentIndex) => {
    const index = item.children.findIndex(({ path }) => path === child);
    if (index !== -1) {
      foundIndex = parentIndex;
    }
  });

  return foundIndex;
};

// const sidebar_state = {
//   isOpen: boolean,
//   items: SidebarItem[],
// };

// type SidebarItem = {
//   id: string,
//   isActive: boolean,
// }
