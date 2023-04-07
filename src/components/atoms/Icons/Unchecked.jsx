import { createIcon } from "@chakra-ui/icons";

const UncheckedIcon = createIcon({
  displayName: "UncheckedIcon",
  defaultProps: {
    width: "28px",
    height: "28px",
  },
  viewBox: "0 0 24 24",
  path: (
    <path
      fill="currentColor"
      d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"
    />
  ),
});

export default UncheckedIcon;
