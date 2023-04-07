import { createIcon } from "@chakra-ui/icons";

const PaginationRightIcon = createIcon({
  displayName: "PaginationRightIcon",
  defaultProps: {
    width: "24px",
    height: "24px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"
    />
  ),
});

export default PaginationRightIcon;
