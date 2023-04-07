import { Box, Flex, Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function Transactions({ transactions }) {
  const { t } = useTranslation();
  const count = transactions.reduce((acc, curr) => {
    return acc + curr.value;
  }, 0);

  return (
    <Box {...css.container}>
      <Flex {...css.header}>
        <Heading {...css.heading}>{t("transactions")}</Heading>
        <Text {...css.count}>
          {count} {t("pcs")}
        </Text>
      </Flex>
      <SimpleGrid {...css.grid}>
        {transactions.map((transaction) => (
          <Box {...css.box} key={transaction.name}>
            <Heading size="md">{t(transaction.name)} </Heading>
            <Text {...css.mainCount}>
              {transaction.value}
              <Text {...css.unit}>unit</Text>
            </Text>
            <Flex {...css.icon}>
              <Image
                width="24px"
                src={transaction.icon}
                alt={transaction.name}
              />
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Transactions;

Transactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      icon: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

const css = {
  container: {
    borderRadius: "20px",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
    height: "450px",
    overflowY: "auto",
    bg: "colors.grayF9",
  },
  header: {
    p: "8px 2px",
    bg: "colors.sidebar",
    position: "sticky",
    top: "0",
    justifyContent: "space-between",
  },
  heading: {
    fontSize: "28px",
    padding: "6px 15px",
    size: "lg",
    fontWeight: 600,
  },
  count: {
    color: "brand.500",
    fontSize: "32px",
    fontWeight: 700,
    pr: 5,
  },
  grid: {
    columns: 2,
    gap: "20px",
    p: "17px 18px",
  },
  box: {
    bg: "colors.grayF9",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "20px",
    p: "14px 16px",
  },
  mainCount: {
    color: "brand.500",
    fontSize: "30px",
    mt: "6px",
    fontWeight: 700,
  },
  unit: {
    as: "span",
    color: "colors.placeholder",
    fontWeight: 500,
    ml: "6px",
    fontSize: "20px",
  },
  icon: {
    width: "44px",
    height: "44px",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "12px",
    marginLeft: "auto",
    marginTop: "10px",
  },
};
