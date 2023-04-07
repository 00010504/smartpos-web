import { Breadcrumb as ChBreadcumb, BreadcrumbItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Breadcrumb({ options, containerStyles }) {
  return (
    <ChBreadcumb mt="5px" mb="35px" separator="•" {...containerStyles}>
      {options.map((option, index) => (
        <BreadcrumbItem
          fontWeight={400}
          key={option.name}
          color={index === options.length - 1 ? "gray.400" : "#6F6F6F#"}
        >
          {option.href ? (
            <Link to={option.href}>{option.name}</Link>
          ) : (
            <p>{option.name}</p>
          )}
        </BreadcrumbItem>
      ))}
    </ChBreadcumb>
  );
}

export default Breadcrumb;

Breadcrumb.defaultProps = {
  containerStyles: {},
};

Breadcrumb.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  containerStyles: PropTypes.shape({}),
};
