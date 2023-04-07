import { Tr, Td, Checkbox, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useAbilityContext } from "@/contexts/abilityContext";
import { CHANGE_PRODUCT_STOCK } from "@/constants/permissions";
import useSection from "@/hooks/useSection";
import Input from "@/components/molecules/Input/Input";
// import NumberInput from "@/components/molecules/Input/NumberInput";
import PropTypes from "prop-types";
import { tableStyles } from "../data";

function RemainsRow({ title, index, control, errors, getValues }) {
  const { t } = useTranslation();
  const ability = useAbilityContext();
  const section = useSection();

  const { is_available } = getValues(`measurement_values.${index}`) ?? {};
  const defaultChecked = !is_available ? { defaultChecked: !is_available } : {};

  return (
    <Tr>
      <Td {...tableStyles.td}>
        <Checkbox iconColor="#fff" {...defaultChecked} />
      </Td>
      <Td {...tableStyles.td}>{title}</Td>
      <Td width="130px" {...tableStyles.td}>
        <Input
          name={`measurement_values.${index}.amount`}
          control={control}
          errors={errors}
          inputProps={{
            placeholder: "0",
            disabled: !ability.can(CHANGE_PRODUCT_STOCK, section),
          }}
          rightElementValue={
            <Text mt="-8px" color="colors.greyD9" bg="colors.body" p="4px">
              {t("pcs")}
            </Text>
          }
        />
      </Td>
      <Td {...tableStyles.td}>
        <Input
          name={`measurement_values.${index}.small_left`}
          control={control}
          errors={errors}
          inputProps={{
            placeholder: "0",
            type: "number",
            disabled: !ability.can(CHANGE_PRODUCT_STOCK, section),
          }}
          rightElementValue={
            <Text mt="-8px" color="colors.greyD9" p="4px">
              {t("pcs")}
            </Text>
          }
        />
      </Td>
    </Tr>
  );
}

export default RemainsRow;

RemainsRow.propTypes = {
  title: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  getValues: PropTypes.func.isRequired,
};
