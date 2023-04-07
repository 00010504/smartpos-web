import * as yup from "yup";
import schemaFieldTypes from "@/utils/validationSchema";

/**
 * A function that creates and returns a yup schema based on the validation schema fields passed in
 * @param {array} config array of tuples of form input name and schema field type (from validationSchema.js)
 * @returns {object} yup schema
 * @example <caption>Here we create yup schema for input named 'inputName' with 'default' validation schema type from 'validationSchema.js'</caption>
 * const schema = createSchema(["inputName", "default"]);
 * // then we provide the schema to the useForm hook
 * const { register, handleSubmit, formState: {errors} } = useForm({ resolver: yupResolver(schema) });
 * // and then we can register an input with the name 'inputName' and use the errors object to display errors
 * @requires module:yup
 * @requires module:src/utils/validationSchema
 * @see {@link src/utils/validationSchema.js}
 * @see {@link src/components/templates/AuthComponent/RegisterSection/RegisterSection.jsx}
 */
export default function createSchema(config = []) {
  const entries = Object.entries(config).map(([inputName, schemaFieldType]) => [
    inputName,
    schemaFieldTypes[schemaFieldType],
  ]);

  return yup.object().shape(Object.fromEntries(entries));
}
