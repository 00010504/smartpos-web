import createSchema from "@/helpers/createSchema";

// form fields and validation 🚧
export const schema = createSchema({
  name: "default",
});

export const values = {
  name: "",
};

export const ACTIONS = {
  changePermission: "changePermission",
  changeSection: "changeSection",
  changeModule: "changeModule",
};

export const reducer = (state, { type, payload }) => {
  const [...clonedState] = state;

  switch (type) {
    case ACTIONS.changePermission: {
      const moduleIndex = clonedState.findIndex(
        (mod) => mod.name === payload.module_id,
      );
      const sectionIndex = clonedState[moduleIndex].sections.findIndex(
        (mod) => mod.id === payload.section_id,
      );
      const permissionIndex = clonedState[moduleIndex].sections[
        sectionIndex
      ].permissions.findIndex((mod) => mod.id === payload.permission_id);

      clonedState[moduleIndex].sections[sectionIndex].permissions[
        permissionIndex
      ].is_added = payload.is_added;

      return clonedState;
    }

    case ACTIONS.changeSection: {
      const moduleIndex = clonedState.findIndex(
        (mod) => mod.name === payload.module_id,
      );
      const sectionIndex = clonedState[moduleIndex].sections.findIndex(
        (mod) => mod.id === payload.section_id,
      );

      clonedState[moduleIndex].sections[sectionIndex] = {
        ...clonedState[moduleIndex].sections[sectionIndex],
        is_added: payload.is_added,
      };

      clonedState[moduleIndex].sections[sectionIndex].permissions = clonedState[
        moduleIndex
      ].sections[sectionIndex].permissions?.map((permission) => {
        return { ...permission, is_added: payload.is_added };
      });

      return clonedState;
    }

    case ACTIONS.changeModule: {
      const moduleIndex = clonedState.findIndex(
        (mod) => mod.name === payload.module_id,
      );
      const newSections = clonedState[moduleIndex].sections?.map((section) => {
        return {
          ...section,
          is_added: payload.is_added,
          permissions: section?.permissions?.map((permission) => {
            return { ...permission, is_added: payload.is_added };
          }),
        };
      });
      clonedState[moduleIndex].sections = newSections;

      return clonedState;
    }

    default:
      return clonedState;
  }
};

export const styles = {
  inputStyles: {
    padding: "23px 14px",
    borderRadius: "10px",
    fontWeight: "500",
    outline: "1px solid rgba(0, 0, 0, 0.15)",
  },
};
