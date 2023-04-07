import { Image, Tooltip } from "@chakra-ui/react";
import AlertIcon from "@/assets/AlertGray.svg";
import PropTypes from "prop-types";

export default function Alert({ label = "", ...rest }) {
  return (
    <Tooltip
      label={label}
      aria-label="A tooltip"
      hasArrow
      placement="top"
      offset={[0, 20]}
      {...rest}
    >
      <Image src={AlertIcon} alt="alert icon" />
    </Tooltip>
  );
}

Alert.propTypes = {
  label: PropTypes.string.isRequired,
};
