import createSchema from "@/helpers/createSchema";
import { createClient, updateClient } from "@/services";
import { t } from "@/utils/i18n";
import { format } from "date-fns";
import { cloneDeep } from "lodash";

// state management
export const ACTIONS = {
  SET_VALUES: "SET_VALUES",
};

export function formReducer(state, action) {
  const clonedState = cloneDeep(state);
  const { type, payload } = action;

  switch (type) {
    case ACTIONS.SET_VALUES: {
      const { client } = payload; // groups
      if (client) {
        Object.keys(clonedState).forEach((key) => {
          // from `sex` to `sex_id`
          if (key === "sex_id") {
            clonedState.sex_id = client.sex.id;
          }
          // from `group` to `group_id`
          else if (key === "group") {
            clonedState.group_id = client[key];
          }
          // normalize date
          else if (key === "birthday") {
            clonedState[key] = format(new Date(client[key]), "yyyy-MM-dd");
          } else if (client[key]) {
            clonedState[key] = client[key];
          }
        });

        return clonedState;
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

const genders = {
  male: "1fe92aa8-2a61-4bf1-b907-182b497584ad",
  female: "9fb3ada6-a73b-4b81-9295-5c1605e54552",
};

export const initialValues = {
  first_name: "",
  last_name: "",
  group_id: "",
  birthday: "",
  card_number: "",
  phone_number: "",
  email: "",
  sex_id: genders.male,
  info: "",
};

export const schema = createSchema({
  first_name: "default",
  last_name: "default",
  // group_id: "select",
  birthday: "date",
  card_number: "default",
  phone_number: "phone",
  email: "email",
  // sex_id: ""
});

export const genderOptions = [
  {
    label: t("male"),
    value: genders.male,
  },
  {
    label: t("female"),
    value: genders.female,
  },
];

// functions
export function getMutationFn(client_id) {
  if (client_id) {
    return updateClient.bind(null, client_id);
  }
  return createClient;
}

// styles
export const inputStyles = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};
