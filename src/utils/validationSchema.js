import * as yup from "yup";
import { t } from "@/utils/i18n";

const schemaFieldTypes = {
  default: yup
    .string()
    .strict()
    .trim(t("spaces_error"))
    .required(t("required_field_error")),
  auth_password: yup
    .string()
    .required(t("required_field_error"))
    .min(6, t("min_6_chars_error")),
  retypePassword: yup
    .string()
    .test("passwords-match", "Passwords must match", function test(value) {
      return this.parent.new_password === value;
    }),
  phone: yup
    .string()
    .required(t("required_field_error"))
    .matches(
      /^998([- ])?(55|90|91|93|94|95|98|99|33|97|88|71|77)([- ])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$/,
      t("invalid_phone_number"),
    ),
  phoneWithout998: yup
    .string()
    .required(t("required_field_error"))
    .matches(
      /^(55|90|91|93|94|95|98|99|33|97|88|71|77)([- ])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$/,
      t("invalid_phone_number"),
    ),
  select: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string(),
    })
    .nullable()
    .required(t("required_field_error")),
  multiselect: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string(),
        value: yup.string(),
      }),
    )
    .min(1, t("required_field_error")),
  required: yup.mixed().strict().required(t("required_field_error")),
  email: yup.string().email(t("valid_email")),
  number: yup.number(t("valid_number")).required(t("required_field_error")),
  address: yup.string().min(10, t("min_10_chars_error")),
  zip: yup.string().min(6, t("min_6_chars")),
  date: yup.date().typeError("enter_valid_date").required(),
  dateBiggerThanYesterday: yup
    .date()
    .typeError("enter_valid_date")
    .required()
    .min(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      t("date_must_be_bigger_than_yesterday"),
    )
    .max(new Date(2099, 0, 1), t("enter_valid_date")),
  percentage: yup
    .number()
    .typeError(t("required_field_error"))
    .required(t("required_field_error"))
    .max(100, t("invalid_discount")),
  discountAmount: yup
    .string()
    .required(t("required_field_error"))
    .test("discountAmount", t("invalid_discount"), function test(value) {
      return +this.parent.orderAmount > +value;
    }),
};

export default schemaFieldTypes;
