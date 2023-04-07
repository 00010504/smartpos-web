import Card from "@/components/atoms/Card";
import { SimpleGrid } from "@chakra-ui/react";
import PropTypes from "prop-types";

function SalesCounts({ salesCounts }) {
  return (
    <SimpleGrid columns={4} gap="20px">
      {salesCounts.map((salesCount) => (
        <Card data={salesCount} showStatistics key={salesCount.title} />
      ))}
    </SimpleGrid>
  );
}

export default SalesCounts;

SalesCounts.propTypes = {
  salesCounts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
};
