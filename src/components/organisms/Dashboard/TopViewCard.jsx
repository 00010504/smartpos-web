import { Box, Flex, Text, Heading } from "@chakra-ui/react";
import shortenNum from "@/helpers/shortenNum";
import PropTypes from "prop-types";

function TopViewCard({ data, unit, title }) {
  return (
    <Box {...css.container}>
      <Flex {...css.heading}>
        <Heading size="lg">{title}</Heading>
      </Flex>
      {data?.map((field) => (
        <Flex key={`${field.name}_${field.price}`} {...css.flex}>
          <Text {...css.name}>{field.name}</Text>
          <Text>
            {shortenNum(field.price)}
            {unit && <Text {...css.currency}>{unit}</Text>}
          </Text>
        </Flex>
      ))}
    </Box>
  );
}

export default TopViewCard;

TopViewCard.defaultProps = {
  unit: "",
};

TopViewCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    }),
  ).isRequired,
  unit: PropTypes.string,
  title: PropTypes.string.isRequired,
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
  heading: {
    p: "15px",
    bg: "colors.sidebar",
    position: "sticky",
    top: "0",
  },
  flex: {
    justifyContent: "space-between",
    p: "12px 20px",
    borderBottom: "2px solid",
    borderBottomColor: "colors.sidebarBorder",
    color: "colors.text",
    fontWeight: 600,
  },
  name: {
    width: "50%",
    fontSize: "15px",
  },
  currency: {
    as: "span",
    color: "colors.placeholder",
    ml: "5px",
    fontSize: "15px",
  },
};
