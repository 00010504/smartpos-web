import { Tr, Td, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {
  CHANGE_PRICE,
  SEE_PRODUCT_PURCHASE_COSTS,
} from "@/constants/permissions";
import { useAbilityContext } from "@/contexts/abilityContext";
import useSection from "@/hooks/useSection";
import Can from "@/hoc/Can";
import PropTypes from "prop-types";
import NumberInput from "@/components/molecules/Input/NumberInput";
import { tableStyles } from "../data";

function RemainsPriceRow({ index, control, errors, setValue, watch }) {
  const { t } = useTranslation();
  const section = useSection();
  const ability = useAbilityContext();

  const { supply_price, margin, retail_price, title, shop_name } =
    watch(`shop_prices.${index}`) ?? {};

  const onMarginChange = (val) => {
    if (supply_price && val) {
      const retailPrice = +supply_price + (+supply_price * +val) / 100;
      setValue(`shop_prices.${index}.retail_price`, retailPrice.toString());
    }
    return val;
  };

  const onRetailPriceChange = (val) => {
    if (supply_price && margin && val) {
      const modifiedMargin = ((+val - +supply_price) / +supply_price) * 100;
      setValue(
        `shop_prices.${index}.margin`,
        modifiedMargin.toFixed(2).toString(),
      );
    }
    return val;
  };

  const onSupplyPriceChange = (val) => {
    if (retail_price && val) {
      const modifiedMargin = ((+retail_price - +val) / +val) * 100;
      setValue(
        `shop_prices.${index}.margin`,
        modifiedMargin.toFixed(2).toString(),
      );
    } else if (margin && val) {
      const retailPrice = +val + (+val * +margin) / 100;
      setValue(`shop_prices.${index}.retail_price`, retailPrice.toString());
    } else if (!val) {
      setValue(`shop_prices.${index}.retail_price`, "");
      setValue(`shop_prices.${index}.margin`, "");
    }
    return val;
  };

  return (
    <Tr>
      <Td {...tableStyles.td}>{title || shop_name}</Td>
      <Can I={SEE_PRODUCT_PURCHASE_COSTS} a={section}>
        <Td {...tableStyles.td}>
          <NumberInput
            name={`shop_prices.${index}.supply_price`}
            value={supply_price}
            onChange={onSupplyPriceChange}
            setValue={setValue}
            control={control}
            errors={errors}
            inputProps={{
              ...tableStyles.input,
              disabled: !ability.can(CHANGE_PRICE, section),
            }}
            rightElementValue={
              <Text mt="-8px" color="colors.greyD9" p="4px">
                {t("uzs")}
              </Text>
            }
          />
        </Td>
      </Can>

      <Td {...tableStyles.td}>
        <NumberInput
          name={`shop_prices.${index}.margin`}
          value={margin}
          onChange={onMarginChange}
          setValue={setValue}
          control={control}
          errors={errors}
          inputProps={{
            ...tableStyles.input,
            disabled: !ability.can(CHANGE_PRICE, section),
          }}
          rightElementValue={
            <Text mt="-6px" color="colors.greyD9" p="4px">
              %
            </Text>
          }
        />
      </Td>
      <Td {...tableStyles.td}>
        <NumberInput
          name={`shop_prices.${index}.retail_price`}
          value={retail_price}
          onChange={onRetailPriceChange}
          setValue={setValue}
          control={control}
          errors={errors}
          inputProps={{
            ...tableStyles.input,
            disabled: !ability.can(CHANGE_PRICE, section),
          }}
          rightElementValue={
            <Text mt="-8px" color="colors.greyD9" p="4px">
              {t("uzs")}
            </Text>
          }
        />
      </Td>
    </Tr>
  );
}

export default RemainsPriceRow;

RemainsPriceRow.propTypes = {
  index: PropTypes.number.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
};
