import { Box, List, ListItem } from "@chakra-ui/react";
import PropTypes from "prop-types";

function FormNavigation({ options, activeSection }) {
  return (
    <List spacing={3} {...listWrapperStyles}>
      <Box
        {...activeElementStyles}
        top={`${activeSection * 36.6 + (activeSection === 0 ? 1 : 0.5)}px`}
        width="170px"
      />
      {options.map((option, i) => {
        return (
          <a href={`#${option.path}`} key={option.path}>
            <ListItem
              {...listStyles}
              color={activeSection === i ? "#fff" : "#778591"}
            >
              {option.name}
            </ListItem>
          </a>
        );
      })}
    </List>
  );
}

export default FormNavigation;

FormNavigation.defaultProps = {
  options: [],
};

FormNavigation.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string,
      path: PropTypes.string,
    }),
  ),
  activeSection: PropTypes.number.isRequired,
};

const listWrapperStyles = {
  borderRadius: "6px",
  padding: "3px",
  position: "fixed",
  top: "110px",
};
const listStyles = {
  padding: "7px 14px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  height: "36px",
  zIndex: 100,
  transition: "all 0.3s ease",
  marginTop: "0 !important",
};
const activeElementStyles = {
  position: "absolute",
  width: "100%",
  height: "37px",
  backgroundColor: "#256DF6",
  color: "#fff",
  zIndex: "-1",
  left: "4px",
  borderRadius: "6px",
  top: "2px",
};
