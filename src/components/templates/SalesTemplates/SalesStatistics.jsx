import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Statistics from "@/components/molecules/Statistics";
import { useMemo } from "react";

export default function SalesStatistics({ showStatistics, statistics }) {
  const { t } = useTranslation();

  const statisticsData = useMemo(() => {
    if (statistics) {
      return Object.keys(statistics)?.map((key) => {
        return {
          title: t(key),
          value: statistics[key],
          unit: key === "transactions_count" ? "pcs" : "sum",
        };
      });
    }

    return [];
  }, [statistics, t]);

  return (
    <Statistics statistics={statisticsData} showStatistics={showStatistics} />
  );
}

SalesStatistics.defaultProps = {
  statistics: {},
};

SalesStatistics.propTypes = {
  showStatistics: PropTypes.bool.isRequired,
  statistics: PropTypes.shape({}),
};
