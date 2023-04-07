import { createIcon } from "@chakra-ui/icons";

const ExpandIcon = createIcon({
  displayName: "ExpandIcon",
  defaultProps: {
    width: "30px",
    height: "30px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M8.29498 7.41L12.875 12L8.29498 16.59L9.70498 18L15.705 12L9.70498 6L8.29498 7.41Z"
      fill="currentColor"
      fillOpacity="0.54"
    />
  ),
});

export default ExpandIcon;
