import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty } from "lodash";

export default function useHookForm(defaultValues, schema) {
  return useForm({
    defaultValues,
    resolver: !isEmpty(schema) ? yupResolver(schema) : null,
  });
}
