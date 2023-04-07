import RCPagination from "rc-pagination";
import PropTypes from "prop-types";
import "rc-pagination/assets/index.css";
import PaginationLeftIcon from "@/components/atoms/Icons/PaginationLeft";
import PaginationRightIcon from "@/components/atoms/Icons/PaginationRight";
import "./Pagination.css";
import { Button } from "@chakra-ui/react";

function itemRender(page, type, onChange, current) {
  if (type === "prev") {
    return <PaginationLeftIcon color="colors.headingColor" />;
  }
  if (type === "next") {
    return <PaginationRightIcon color="colors.headingColor" />;
  }
  return (
    <Button
      width="20px"
      variant="link"
      className="pagination__item"
      onClick={() => onChange(page)}
      fontWeight="normal"
      height="37px"
      bg={current === page ? "brand.500" : "transparent"}
      _hover={{ textDecoration: "none" }}
      color={current === page ? "#fff" : "colors.text"}
    >
      {page}
    </Button>
  );
}

function Pagination({ current, total, onChange, disabled, pageSize }) {
  return (
    <RCPagination
      className="pagination"
      disabled={disabled}
      current={current}
      total={total}
      onChange={onChange}
      itemRender={(page, type) => itemRender(page, type, onChange, current)}
      showTitle={false}
      pageSize={pageSize || 10}
    />
  );
}

export default Pagination;

Pagination.defaultProps = {
  disabled: false,
};

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  pageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
