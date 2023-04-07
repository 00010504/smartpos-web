import { Box, Flex, Grid, GridItem, Heading, Image } from "@chakra-ui/react";
import CountUp from "@/components/molecules/CountUp";
import PriceIcon from "@/assets/icons/price.svg";
import PropTypes from "prop-types";
import StatisticsChart from "./StatisticsChart";

export default function ProductsStatisticsOld({ showStatistics }) {
  return (
    <Grid gridTemplateColumns="50% 50%" alignItems="center">
      <GridItem>
        <StatisticsChart />
      </GridItem>
      <GridItem transform="translateY(-30px)">
        <Flex gap="24px">
          <Box {...styles.boxStyles}>
            <Box {...styles.iconStyles}>
              <Image width="30px" src={PriceIcon} alt="" />
            </Box>
            <Heading {...styles.mediumHeadingSyles}>Arrival price </Heading>
            <Heading size="lg" fontWeight={600}>
              <CountUp
                end={6.6}
                duration={1}
                decimals={1}
                delay={0.5}
                suffix=" billion "
                in={showStatistics}
              />

              <span style={styles.sumStyles}>sum</span>
            </Heading>
          </Box>
          <Box {...styles.boxStyles}>
            <Box {...styles.iconStyles}>
              <Image width="30px" src={PriceIcon} alt="" />
            </Box>
            <Heading {...styles.mediumHeadingSyles}>Selling price</Heading>
            <Heading size="lg" fontWeight={600}>
              <CountUp
                end={8.2}
                duration={1}
                decimals={1}
                delay={0.5}
                suffix=" billion "
                in={showStatistics}
              />

              <span style={styles.sumStyles}>sum</span>
            </Heading>
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  );
}

ProductsStatisticsOld.propTypes = {
  showStatistics: PropTypes.bool.isRequired,
};

const styles = {
  boxStyles: {
    padding: "20px 24px",
    borderRadius: "20px",
    border: "1px solid #F2F4F6",
    width: "40%",
  },
  iconStyles: {
    width: "60px",
    height: "60px",
    background: "#f2f8ff",
    borderRadius: "10px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mediumHeadingSyles: {
    fontWeight: 500,
    size: "md",
    marginBottom: "5px",
    fontSize: "18px",
  },
  sumStyles: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#6F6F6F",
  },
};
