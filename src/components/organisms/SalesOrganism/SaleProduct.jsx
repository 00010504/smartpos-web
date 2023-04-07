import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  SimpleGrid,
  FormLabel,
  IconButton,
  Center,
  Input,
} from "@chakra-ui/react";
import Image from "@/components/atoms/Image";
import priceFormatter from "@/helpers/priceFormatter";
import { deleteOrderItem, editOrderItem } from "@/services";
import useLatestClosure from "@/hooks/useLatestClosure";
import Placeholder from "@/assets/images/icons/image-placeholder.svg";
import { getOrder, productStyles as css } from "./data";

export default function SaleProduct({ orderItem }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const queryClient = useQueryClient();
  const ref = useRef();
  const order = getOrder();
  const { t } = useTranslation();

  const changeOrderItem = (value) => {
    editOrderItem(orderItem.id, {
      value,
      discount: orderItem.discount,
    }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["order", order.id],
      });
    });
  };

  const deleteItem = () => {
    deleteOrderItem(orderItem.id).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["order", order.id],
      });
      onClose();
    });
  };

  const productChangeCount = (action, value) => {
    if (action === "decrement") {
      if (orderItem.value === 1) deleteItem();
      if (ref.current?.value) {
        ref.current.value = orderItem.value - 1;
      }
      return changeOrderItem(
        orderItem.value !== null ? orderItem.value - 1 : 0,
      );
    }
    if (action === "change") {
      return changeOrderItem(value);
    }
    if (ref.current?.value) {
      ref.current.value = orderItem.value + 1;
    }
    return changeOrderItem(orderItem.value !== null ? orderItem.value + 1 : 1);
  };

  const debouncedOnChange = useLatestClosure(
    debounce((e) => productChangeCount("change", +e.target.value), 500),
  );

  return (
    <motion.div variants={css.wrapperMotion} initial="hidden" animate="visible">
      <Flex {...css.container}>
        <Flex {...css.buttonsWrapper}>
          <Button
            {...css.buttonStyles}
            onClick={() => productChangeCount("decrement")}
          >
            <MinusIcon color="colors.text" />
          </Button>
          <Text {...css.countText}>{orderItem.value ?? 0}</Text>
          <Button
            {...css.buttonStyles}
            onClick={() => productChangeCount("increment")}
          >
            <AddIcon color="colors.text" />
          </Button>
        </Flex>
        <Flex {...css.mainFlex}>
          <Image
            props={{
              alt: orderItem.product_name,
              src: `${import.meta.env.VITE_CDN_URL}/${orderItem.image}`,
            }}
            styles={css.image}
          />
          <Box>
            <Text {...css.productName} onClick={onOpen}>
              {orderItem.product_name}
            </Text>
            <Text {...css.mxikCode}>{orderItem.mxik_code}</Text>
          </Box>
        </Flex>
        <Flex {...css.pricesWrapper}>
          {orderItem.discount.price > 0 && (
            <Text {...css.discount}>
              {priceFormatter(orderItem.price)} {t("sum")}
            </Text>
          )}

          <Text {...css.price}>
            {priceFormatter(orderItem?.new_price)} {t("sum")}
          </Text>
        </Flex>
      </Flex>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent {...css.modalContent}>
            <ModalBody>
              <SimpleGrid gap="20px">
                <SimpleGrid {...css.modalImageAndNameGrid}>
                  <Box
                    {...css.modalImageWrapper}
                    backgroundImage={
                      orderItem.image
                        ? `${import.meta.env.VITE_CDN_URL}/${orderItem.image}`
                        : Placeholder
                    }
                  />
                  <Text {...css.modalProductName}>
                    {orderItem.product_name}
                  </Text>
                </SimpleGrid>
                <Box>
                  <FormLabel color="colors.icon">{t("price")}</FormLabel>
                  <Box {...css.modalPrice}>
                    {priceFormatter(orderItem.price)} {t("sum")}
                  </Box>
                </Box>
                <Box>
                  <FormLabel color="colors.icon">{t("quantity")}</FormLabel>
                  <SimpleGrid {...css.modalChangeValueGrid}>
                    <IconButton
                      onClick={() => productChangeCount("decrement")}
                      height="55px"
                      color="#fff"
                      icon={<MinusIcon />}
                    />
                    <Center {...css.modalPriceCenter}>
                      <Input
                        ref={ref}
                        onChange={debouncedOnChange}
                        onFocus={(event) => event.target.select()}
                        defaultValue={orderItem.value ?? 0}
                        {...css.modalInput}
                      />
                    </Center>
                    <IconButton
                      onClick={() => productChangeCount("increment")}
                      height="55px"
                      color="#fff"
                      icon={<AddIcon />}
                    />
                  </SimpleGrid>
                </Box>
                <SimpleGrid {...css.modalBottomGrid}>
                  <Flex {...css.modalTotalPrice}>
                    <Box as="span" color="colors.text">
                      {t("total")}:
                    </Box>
                    <Box as="span" color="colors.text">
                      {priceFormatter(orderItem.total_price || 0)} uzs
                    </Box>
                  </Flex>
                  <Button height="48px" onClick={onClose} color="#fff" pt="4px">
                    {t("close")}
                  </Button>
                </SimpleGrid>
              </SimpleGrid>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </motion.div>
  );
}

SaleProduct.defaultProps = {};

SaleProduct.propTypes = {
  orderItem: PropTypes.shape({
    image: PropTypes.string,
    product_name: PropTypes.string,
    mxik_code: PropTypes.string,
    value: PropTypes.number,
    price: PropTypes.number,
    id: PropTypes.string,
    new_price: PropTypes.number,
    total_price: PropTypes.number,
    discount: PropTypes.shape({
      price: PropTypes.number,
    }),
  }).isRequired,
};
