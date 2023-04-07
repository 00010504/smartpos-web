import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import qs from "qs";
import Statistics from "@/components/molecules/Statistics";
import LocalStorage from "@/utils/LocalStorage";
import { getProductsQuery } from "@/queries";
import { initialData } from "./data";

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

const params = {
  active_for_sale: "all",
  search: "",
  limit: String(LocalStorage?.products_table?.page_size || 10),
  page: "1",
  ...parsed,
};

export default function ProductsStatistics({ showStatistics }) {
  const { t } = useTranslation();

  let { data: queryData } = useQuery({ ...getProductsQuery(params) });
  queryData = queryData ?? initialData;

  const statisticsData = Object.keys(queryData?.statistics)?.map((key) => {
    return {
      title: t(key),
      value: queryData.statistics[key],
      unit: key === "number_of_products" ? t("pcs") : t("sum"),
    };
  });

  return (
    <Statistics statistics={statisticsData} showStatistics={showStatistics} />
  );
}

ProductsStatistics.propTypes = {
  showStatistics: PropTypes.bool.isRequired,
};
