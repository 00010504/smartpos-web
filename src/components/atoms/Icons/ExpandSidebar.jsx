import { createIcon } from "@chakra-ui/icons";

const ExpandSidebarIcon = createIcon({
  displayName: "ExpandSidebarIcon",
  defaultProps: {
    width: "24px",
    height: "24px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      xmlns="http://www.w3.org/2000/svg"
      d="M15.7051 16.59L11.1251 12L15.7051 7.41L14.2951 6L8.29508 12L14.2951 18L15.7051 16.59Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
  ),
});

export default ExpandSidebarIcon;
