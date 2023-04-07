import { Box, Text } from "@chakra-ui/react";
import CountUp from "@/components/molecules/CountUp";
import PropTypes from "prop-types";

function Card({ data, showStatistics }) {
  return (
    <Box key={data.title} {...styles.card}>
      <Text {...styles.title}>{data.title}</Text>
      <Text {...styles.count}>
        <CountUp end={data.value} duration={1} in={showStatistics} />
        <Text {...styles.count_unit} as="span">
          {data.unit}
        </Text>
      </Text>
    </Box>
  );
}

export default Card;

const styles = {
  card: {
    padding: "20px 22px",
    backgroundColor: "colors.grayF9",
    borderRadius: "20px",
    border: "2px solid",
    borderColor: "colors.sidebarBorder",
  },
  title: {
    mb: "12px",
    fontSize: "18px",
    color: "colors.text",
    fontWeight: "bold",
  },
  count: {
    fontSize: "28px",
    color: "#256DF6",
    fontWeight: "bold",
  },
  count_unit: {
    fontSize: "16px",
    color: "colors.icon",
    ml: "8px",
    fontWeight: "normal",
  },
};

Card.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    unit: PropTypes.string.isRequired,
  }).isRequired,
  showStatistics: PropTypes.bool.isRequired,
};
