import { SimpleGrid } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Card from "../atoms/Card";

function Statistics({ statistics, showStatistics }) {
  return (
    <SimpleGrid columns={4} gap="24px" mb={10}>
      {statistics.map((data) => (
        <Card data={data} key={data.title} showStatistics={showStatistics} />
      ))}
    </SimpleGrid>
  );
}

export default Statistics;

Statistics.defaultProps = {
  statistics: [],
};

Statistics.propTypes = {
  statistics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      unit: PropTypes.string,
    }),
  ),
  showStatistics: PropTypes.bool.isRequired,
};
