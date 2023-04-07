import PropTypes from "prop-types";
import { Grid, GridItem } from "@chakra-ui/react";

export default function NewSaleLayout({ header, main, footer, aside }) {
  return (
    <Grid
      templateRows="repeat(12, 1fr)"
      templateColumns="repeat(3, 1fr)"
      gap="30px 100px"
      h="700px"
      pb={0}
    >
      <GridItem rowSpan={1} colSpan={2}>
        {header}
      </GridItem>
      <GridItem colSpan={1} rowSpan={12}>
        {aside}
      </GridItem>
      <GridItem rowSpan={10} colSpan={2}>
        {main}
      </GridItem>
      <GridItem rowSpan={1} colSpan={2}>
        {footer}
      </GridItem>
    </Grid>
  );
}

NewSaleLayout.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
  main: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
  footer: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
  aside: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
    PropTypes.elementType,
  ]).isRequired,
};
