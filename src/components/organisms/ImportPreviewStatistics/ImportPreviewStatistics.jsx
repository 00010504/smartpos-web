import { SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Card from "@/components/atoms/Card";
import "./ImportPreviewStatistics.css";

function ImportPreviewStatistics({ statistics }) {
  const { t } = useTranslation();

  return (
    <SimpleGrid gap="25px" borderRadius="20px" paddingBottom="30px">
      {Object.keys(statistics).map((key) => (
        <Card
          key={key}
          showStatistics
          data={{
            title: t(key),
            value: statistics[key],
            unit:
              key === "sale_price" || key === "supply_price"
                ? t("sum")
                : t("pcs"),
          }}
        />
      ))}
    </SimpleGrid>
  );
}

export default ImportPreviewStatistics;

ImportPreviewStatistics.propTypes = {
  statistics: PropTypes.shape({
    products: PropTypes.number,
    trade_units: PropTypes.number,
    sale_price: PropTypes.number,
    supply_price: PropTypes.number,
  }).isRequired,
};
