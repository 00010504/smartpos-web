import { createIcon } from "@chakra-ui/icons";

const PaginationLeftIcon = createIcon({
  displayName: "PaginationLeftIcon",
  defaultProps: {
    width: "30px",
    height: "30px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"
    />
  ),
});

export default PaginationLeftIcon;
