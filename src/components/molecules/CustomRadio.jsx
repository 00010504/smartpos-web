import { Box, FormControl, FormLabel, Flex, VStack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import CheckedIcon from "../atoms/Icons/CheckedIcon";
import UncheckedIcon from "../atoms/Icons/Unchecked";

function CustomRadio({ options, active, onChange, label, child }) {
  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <Flex {...containerStyles} gap="15px">
        {options.map((option) => {
          const activeStyle = option.value === active && switchStyles.active;
          if (child) {
            return (
              <VStack key={option.value} spacing={4} align="stretch">
                <Box
                  w={200}
                  flexGrow={1}
                  onClick={() => {
                    onChange(option.value);
                  }}
                  key={option.value}
                  {...switchStyles}
                  {...switchStyles.all}
                  {...activeStyle}
                >
                  {option.value === active ? (
                    <CheckedIcon mt="-2px" color="#fff" />
                  ) : (
                    <UncheckedIcon mt="-1px" color="colors.icon" />
                  )}
                  {option.label}
                </Box>
                {child}
              </VStack>
            );
          }
          return (
            <Box
              flexGrow={1}
              onClick={() => {
                onChange(option.value);
              }}
              key={option.value}
              {...switchStyles}
              {...switchStyles.all}
              {...activeStyle}
            >
              {option.value === active ? (
                <CheckedIcon mt="-2px" color="#fff" />
              ) : (
                <UncheckedIcon mt="-1px" color="colors.greyD9" />
              )}
              {option.label}
            </Box>
          );
        })}
      </Flex>
    </FormControl>
  );
}

export default CustomRadio;

// default props
CustomRadio.defaultProps = {
  label: "",
  child: null,
};
CustomRadio.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  child: PropTypes.node,
};

const containerStyles = {
  borderRadius: "10px",
  position: "relative",
  overflow: "hidden",
};
const switchStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: 600,
  height: "54px",
  cursor: "pointer",
  zIndex: 1,
  position: "relative",
  backgroundColor: "colors.activeStatus",
  transition: "all 0.2s ease",
  borderRadius: "10px",
  color: "#737373",
  gap: "14px",
  active: {
    backgroundColor: "#256DF6",
    color: "#fff",
  },
};
