import { createIcon } from "@chakra-ui/icons";

const LeftIcon = createIcon({
  displayName: "LeftIcon",
  defaultProps: {
    width: "24px",
    height: "24px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M12.707 17.293 8.414 13H18v-2H8.414l4.293-4.293-1.414-1.414L4.586 12l6.707 6.707z"
    />
  ),
});

export default LeftIcon;
