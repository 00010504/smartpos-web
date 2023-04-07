import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Text, Flex, Box, Center, SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import PropTypes from "prop-types";
import { updateOrderItem } from "@/services";
import { getOrderQuery } from "@/queries";
import LocalStorage from "@/utils/LocalStorage";
import priceFormatter from "@/helpers/priceFormatter";
import Image from "../atoms/Image";

export default function SearchList({
  items,
  onItemClick,
  searchWord,
  clearSearch,
}) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const order_id = LocalStorage.order?.id ?? "";

  const { data } = useQuery({
    ...getOrderQuery(order_id),
    enabled: !!order_id,
  });

  const handleProductClick = (product_id) => {
    const payload = {
      order_id,
      product_id,
      value: 1,
    };
    updateOrderItem(payload)
      .then(() => {
        queryClient.invalidateQueries({
          queryKey: ["order", order_id],
        });
        if (typeof clearSearch === "function") {
          clearSearch();
        }
      })
      .then(() => {
        onItemClick();
      });
  };

  return (
    <Box>
      {items.map((item) => (
        <SimpleGrid
          onClick={() => handleProductClick(item.id)}
          key={item.id}
          {...styles.item}
        >
          <SimpleGrid {...styles.itemLeft}>
            <Image
              props={{
                src: item.image,
                styles: styles.image,
                alt: "product image",
              }}
            />

            <Box>
              <Text {...styles.title}>{item?.name}</Text>
              <Flex>
                <Text {...styles.sku}>
                  <Highlighter
                    highlightClassName="highlightText"
                    searchWords={[searchWord]}
                    autoEscape
                    textToHighlight={item?.sku}
                  />
                </Text>
                <Text as="span" mx="4px">
                  /
                </Text>
                <Text {...styles.sku}>
                  <Highlighter
                    highlightClassName="highlightText"
                    searchWords={[searchWord]}
                    autoEscape
                    textToHighlight={item?.barcodes[0]}
                  />
                </Text>
              </Flex>
            </Box>
          </SimpleGrid>
          <Flex direction="column" alignItems="flex-end">
            <Text {...styles.price}>
              {priceFormatter(
                item?.shop_prices[data?.shop?.id]?.retail_price,
              ) || 0}
              <Text pl="6px" as="span" fontSize="14px" color="colors.greyF9">
                {t("sum")}
              </Text>
            </Text>
            <Text {...styles.stock}>
              <Text as="span" color="#bdbdbd" mr="5px">
                {t("stock")}:
              </Text>
              {item.measurement_values?.[data?.shop?.id]?.amount || 0}
            </Text>
          </Flex>
        </SimpleGrid>
      ))}
      {items.length === 0 && (
        <Center h={10} bg="#fff" p="36px" borderRadius="10px">
          🙁{" "}
          <Text color="grey.800" ml={2}>
            {t("products_not_found")}
          </Text>
        </Center>
      )}
    </Box>
  );
}

SearchList.defaultProps = {
  searchWord: "",
};

SearchList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
  searchWord: PropTypes.string,
  clearSearch: PropTypes.func.isRequired,
};

const styles = {
  item: {
    p: "10px 20px",
    mb: "15px",
    cursor: "pointer",
    borderRadius: "10px",
    bg: "colors.sidebar",
    transition: "0.3s all easy",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    alignItems: "center",
  },
  itemLeft: {
    gridTemplateColumns: "50px auto",
    gap: "18px",
    alignItems: "center",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "18px",
    color: "colors.link",
    lineHeight: 1.3,
    mb: "5px",
  },
  price: {
    fontSize: "16px",
    fontWeight: 600,
    mb: "2px",
    color: "colors.text",
  },
  stock: {
    fontWeight: 500,
  },
  sku: {
    fontSize: "16px",
    fontWeight: 500,
    color: "colors.text",
  },
};
