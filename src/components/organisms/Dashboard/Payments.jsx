import { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Heading, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import PaymentIcon from "@/assets/icons/payment-bg.svg";
import CashIcon from "@/assets/icons/cash.svg";
import UzCardicon from "@/assets/icons/uzcard.svg";
import priceFormatter from "@/helpers/priceFormatter";

function Payments({ payments, statisticsDate }) {
  const [activeStore, setActiveStore] = useState(payments[0]);
  const { t } = useTranslation();

  useEffect(() => {
    if (payments[0]) {
      setActiveStore(payments[0]);
    } else {
      setActiveStore(null);
    }
  }, [statisticsDate, payments]);

  return (
    <SimpleGrid {...css.container}>
      <SimpleGrid {...css.cardsGrid}>
        {activeStore &&
          activeStore.payments?.map((payment) => (
            <Box {...css.paymentCard} key={payment.name}>
              <Text color="colors.text" fontSize="20px" fontWeight={500}>
                {payment.name}
              </Text>
              <Text color="brand.500" fontSize="24px" mb="5px" fontWeight={700}>
                {priceFormatter(payment.value)}
                <Text {...css.currency}>{t("sum")}</Text>
              </Text>
              <Image
                width="120px"
                position="absolute"
                bottom="0"
                left="50%"
                transform="translateX(-60%)"
                src={PaymentIcon}
                alt=""
              />
              <Box
                border="3px solid"
                borderColor="colors.sidebarBorder"
                borderRadius="12px"
                display="inline-block"
                p="8px"
                position="absolute"
                bottom="10%"
                right="8%"
              >
                {payment.name.toLowerCase() === "cash" ? (
                  <Image src={CashIcon} alt="cash" />
                ) : (
                  <Image src={UzCardicon} alt="uzcard" />
                )}
              </Box>
            </Box>
          ))}
      </SimpleGrid>
      <Box position="relative">
        <Heading {...css.heading}>{t("payments")}</Heading>
        <SimpleGrid {...css.storesGrid}>
          {payments.map((payment) => (
            <Box
              key={payment.id}
              bg={
                payment.id === activeStore?.id
                  ? "colors.sidebarLinkBg"
                  : "colors.grayF9"
              }
              onClick={() => setActiveStore(payment)}
              {...css.button}
            >
              <Text fontSize="15px" fontWeight={600} p="12px 12px 10px 15px">
                {payment.store_name}
              </Text>
            </Box>
          ))}
          <Box {...css.footer}>
            <Text fontSize="18px" color="#454545" fontWeight={500}>
              {t("total")}:
            </Text>
            <Text color="#256DF6" fontWeight={600} fontSize="24px">
              {activeStore?.total_price ?? 0}
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </SimpleGrid>
  );
}

export default Payments;

Payments.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      store_name: PropTypes.string,
      payments: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          value: PropTypes.number,
        }),
      ),
    }),
  ).isRequired,
  statisticsDate: PropTypes.string.isRequired,
};

const css = {
  container: {
    gridTemplateColumns: "60% 40%",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
    borderRadius: "20px",
  },
  cardsGrid: {
    p: "24px",
    // bg: "colors.grayF9",
    borderRight: "3px solid",
    borderColor: "colors.sidebarBorder",
    gap: "25px",
    borderRadius: "20px 0 0 20px",
    alignItems: "start",
    overflow: "auto",
    height: "450px",
  },
  heading: {
    p: "13px 18px",
    size: "lg",
    borderBottom: "2px solid",
    borderColor: "colors.sidebarBorder",
  },
  storesGrid: {
    p: "24px",
    bg: "colors.greyF9",
    gap: "25px",
    height: "200px",
    overflow: "auto",
    alignItems: "start",
  },
  button: {
    transition: "all 0.3s ease",
    cursor: "pointer",
    borderRadius: "10px",
    color: "colors.text",
  },
  footer: {
    mt: "auto",
    position: "absolute",
    bottom: "3%",
    pt: "15px",
    borderTop: "3px solid",
    borderColor: "colors.sidebarBorder",
    width: "100%",
    left: 0,
    pl: "20px",
  },
  paymentCard: {
    p: "24px",
    bg: "colors.body",
    borderRadius: "20px",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
    position: "relative",
  },
  currency: {
    as: "span",
    fontSize: "18px",
    fontWeight: 500,
    color: "colors.placeholder",
    ml: "8px",
    mt: "8px",
  },
};
