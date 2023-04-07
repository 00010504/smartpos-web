import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function Filter({ onQueryComplete }) {
  console.log(onQueryComplete);

  return (
    <Button
      type="button"
      // letterSpacing={0.5}
      transform="translateY(5px)"
      variant="link"
      onClick={() => {}}
    >
      + Filter
    </Button>
  );
}

Filter.defaultProps = {};

Filter.propTypes = {
  onQueryComplete: PropTypes.func.isRequired,
};
