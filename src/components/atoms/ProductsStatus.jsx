import { useState, useEffect } from "react";
import { Button, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function ProductsStatus({ options, effects, count, initialVal }) {
  const [status, setStatus] = useState(initialVal);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (status !== initialVal) {
      effects.forEach((effect) => {
        effect(status);
      });
    }
  }, [status, effects, initialVal]);

  return (
    <Flex {...flexStyles}>
      {options.map((option) => {
        const styles =
          option === status ? buttonStyles.active : buttonStyles.inactive;

        return (
          <Button
            key={option}
            onClick={() => {
              if (option !== status) {
                setIsLoading(true);
                setStatus(option);
              }
            }}
            colorScheme="gray"
            size="sm"
            {...styles}
          >
            {t(option)}

            {!isLoading && status === option && count > 0 && (
              <span style={{ marginLeft: "7px" }}>({count})</span>
            )}
          </Button>
        );
      })}
    </Flex>
  );
}

export default ProductsStatus;

ProductsStatus.defaultProps = {
  count: 0,
  effects: [],
  initialVal: "all",
};

ProductsStatus.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  effects: PropTypes.arrayOf(PropTypes.func),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  initialVal: PropTypes.string,
};

const buttonStyles = {
  active: {
    pt: "2px",
    backgroundColor: "colors.activeStatus",
  },
  inactive: {
    pt: "2px",
    bg: "none",
    color: "gray.400",
    fontWeight: "600",
    fontSize: "15px",
    borderRadius: "8px",
    _hover: {
      bg: "blackAlpha.50",
    },
  },
};

const flexStyles = {
  gap: "8px",
};
