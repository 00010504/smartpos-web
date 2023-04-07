import { useEffect, useState } from "react";
import { Box, Grid, GridItem, FormControl, FormLabel } from "@chakra-ui/react";
import PropTypes from "prop-types";

function CustomSwitch({ options, active, onChange, label }) {
  const [localActive, setLocalActive] = useState(active);

  useEffect(() => {
    if (localActive !== active) {
      setLocalActive(active);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <FormControl>
      {label && <FormLabel>{label}</FormLabel>}
      <Grid gridTemplateColumns="1fr 1fr" {...containerStyles}>
        <Box
          {...activeIndicatorStyles}
          left={localActive === options[0].value ? "6px" : "50%"}
        />
        {options.map((option) => {
          return (
            <GridItem
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setLocalActive(option.value);
              }}
            >
              <Box key={option.value} {...switchStyles} {...switchStyles.all}>
                {option.label}
              </Box>
            </GridItem>
          );
        })}
      </Grid>
    </FormControl>
  );
}

export default CustomSwitch;

CustomSwitch.defaultProps = {
  label: "",
};

CustomSwitch.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

const containerStyles = {
  padding: "5px",
  backgroundColor: "colors.grayF9",
  borderRadius: "10px",
  position: "relative",
};
const switchStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: 500,
  color: "colors.text",
  height: "44px",
  cursor: "pointer",
  zIndex: 1,
  position: "relative",
};
const activeIndicatorStyles = {
  position: "absolute",
  top: "5px",
  boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.05)",
  backgroundColor: "colors.body",
  borderRadius: "10px",
  width: "48%",
  height: "80%",
  transition: "all 0.25s ease",
};
