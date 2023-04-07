import { Stack, Skeleton } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function TableSkeleton({ isLoaded, count }) {
  return (
    <Stack padding={0} spacing={1}>
      {Array.from({ length: count }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={index} height="54px" isLoaded={isLoaded} />
      ))}
    </Stack>
  );
}

TableSkeleton.defaultProps = {
  count: 6,
};

TableSkeleton.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  count: PropTypes.number,
};
