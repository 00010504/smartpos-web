/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  Flex,
  SimpleGrid,
  Heading,
  // Button,
  // Image,
  // IconButton,
  Box,
  Select,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getDashboardQuery, getProfileQuery } from "@/queries";
import SingleQueryClient from "@/classes/SingleQueryClient";
import { lightFormat } from "date-fns";
import qs from "qs";
import { dates } from "@/helpers/getDateRange";
import getRangeDate from "@/helpers/getRangeDate";
import priceFormatter from "@/helpers/priceFormatter";
import SalesCounts from "@/components/templates/Dashboard/SalesCounts";
import SalesChart from "@/components/templates/Dashboard/SalesChart";
import TopViewCard from "@/components/organisms/Dashboard/TopViewCard";
import Payments from "@/components/organisms/Dashboard/Payments";
import Transactions from "@/components/organisms/Dashboard/Transactions";
import DateRangePicker from "@/components/molecules/DateRangePicker/DateRangePicker";
// import WhiteFilterIcon from "@/assets/icons/FilterWhite.svg";
import {
  initialData,
  genSalesCounts,
  genTransactions,
  genPayments,
  styles,
  genDataset,
  genKeys,
  getRangePickerDates,
} from "./data";

const queryClient = SingleQueryClient.getInstance();
let shops = queryClient.getQueryData(["shops"]);

if (shops?.data?.length) {
  shops = shops?.data?.map((store) => store.id).join(",");
}

const parsed = qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

const { date_from, date_to } = getRangePickerDates(parsed);

let params = {
  date_from: lightFormat(date_from, "dd-MM-yyyy 00:00:00"),
  date_to: lightFormat(date_to, "dd-MM-yyyy 23:59:59"),
  analytcs_filter_date_type: "year",
  shops,
  ...parsed,
};

let dateFrom, dateTo;

export default function Dashboard() {
  const [statisticsDate, setStatisticsDate] = useState(
    params.analytcs_filter_date_type,
  );
  const [selectedStore, setSelectedStore] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const { data: queryData } = useQuery({
    ...getDashboardQuery(params),
  });

  const { data: profileData } = useQuery({
    ...getProfileQuery(),
  });

  const data = { ...initialData, ...queryData?.response };

  const dataset = genDataset(data?.shop_analytics);
  const figureKeys = genKeys(dataset);

  const topClients = useMemo(() => {
    if (queryData) {
      const options = queryData.top_clients?.map((client) => {
        return {
          id: client.id,
          name: `${client.first_name} ${client.last_name}`,
          price: client.total_purchase_amount
            ? `${priceFormatter(client.total_purchase_amount)} ${t("uzs")}`
            : 0,
        };
      });
      return options;
    }
    return [];
  }, [queryData]);

  const onRangeChange = (e) => {
    const { startDate, endDate } = e.selection;

    if (startDate && endDate) {
      // && endDate - startDate !== 0
      dateFrom = new Date(startDate);
      dateTo = new Date(endDate);

      const formattedStartDate = lightFormat(startDate, "dd-MM-yyyy 00:00:00");
      const formattedEndDate = lightFormat(endDate, "dd-MM-yyyy 23:59:59");

      const date = getRangeDate({ startDate, endDate });

      params = {
        ...params,
        date_from: formattedStartDate,
        date_to: formattedEndDate,
        analytcs_filter_date_type: date,
      };

      setSearchParams(params);
      setStatisticsDate(date);
      return;
    }

    dateFrom = "";
    dateTo = "";
    setSearchParams({ ...params, date_from: "", date_to: "" });
    setStatisticsDate("year");
  };

  const xAxisZoomOptions = useMemo(() => {
    switch (statisticsDate) {
      case dates.today: {
        return <option>By hour</option>;
      }
      case dates.yesterday: {
        return <option>By hour</option>;
      }
      case dates.week: {
        return <option>By day</option>;
      }
      case dates.month: {
        return <option>By week</option>;
      }
      case dates.year: {
        return <option>By month</option>;
      }
      default: {
        return <option>By hour</option>;
      }
    }
  }, [statisticsDate]);

  const welcomeMsg = profileData?.first_name
    ? `${t("welcome_back")} ${profileData?.first_name} ${
        profileData?.last_name
      }`
    : t("welcome_back");

  useEffect(() => {
    setSearchParams(params);
  }, []);

  return (
    <SimpleGrid gap="23px">
      <Flex my="10px" justifyContent="space-between" alignItems="center">
        <Heading size="md" fontSize="22px">
          {welcomeMsg}
        </Heading>
        <Flex gap="20px">
          <DateRangePicker
            selectionRange={{
              startDate: dateFrom ?? date_from,
              endDate: dateTo ?? date_to,
              key: "selection",
            }}
            onChange={onRangeChange}
            deletable={false}
          />
        </Flex>
      </Flex>
      <SalesCounts salesCounts={genSalesCounts(data)} />
      <SimpleGrid gridTemplateColumns="74.7% 24%" gap="30px 20px">
        <SimpleGrid {...styles.card} gridTemplateColumns="70% 26%" gap="24px">
          <SalesChart
            dataset={dataset}
            figureKeys={figureKeys}
            byDate={statisticsDate}
            selectedStore={selectedStore}
          />
          <Box>
            <Heading mb={5} size="lg">
              {t("sales")}
            </Heading>
            <SimpleGrid gap="20px">
              <Select
                bg="colors.sidebar"
                height="56px"
                borderRadius="15px"
                onChange={(e) => {
                  setSelectedStore(e.target.value);
                }}
              >
                <option key="all">All</option>
                {figureKeys.map((store) => (
                  <option key={store}>{store}</option>
                ))}
              </Select>
              <Select bg="colors.sidebar" height="56px" borderRadius="15px">
                {xAxisZoomOptions}
              </Select>
            </SimpleGrid>
          </Box>
        </SimpleGrid>
        <TopViewCard title={t("top_clients")} data={topClients} />
        <SimpleGrid gridTemplateColumns="55% auto" gap="20px">
          <Payments
            payments={genPayments(data.payments)}
            statisticsDate={statisticsDate}
          />
          <Transactions transactions={genTransactions(data.transactions)} />
        </SimpleGrid>
        <TopViewCard
          title={t("top_products")}
          unit="uzs"
          data={data.top_products}
        />
      </SimpleGrid>
    </SimpleGrid>
  );
}
