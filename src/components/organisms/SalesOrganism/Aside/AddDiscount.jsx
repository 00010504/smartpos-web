import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Button,
  FormControl,
  Heading,
  SimpleGrid,
  useDisclosure,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import CustomSwitch from "@/components/molecules/CustomSwitch";
import Drawer from "@/components/molecules/Drawer";
import InputMask from "@/components/molecules/Input/InputMask";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import { addOrderDiscount } from "@/services";

const schema = createSchema({
  percentage: "percentage",
  amount: "discountAmount",
});
const initialDiscountType = "1fe92aa8-2a61-4bf1-b907-182b497584ad";

export default function AddDiscount({ orderAmount }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const order = JSON.parse(localStorage.getItem("order") || "{}");

  const values = {
    percentage: "",
    amount: "",
    orderAmount: orderAmount.toString(),
    discountType: initialDiscountType,
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
  } = useHookForm(values, schema);

  const onSubmitHandle = handleSubmit((data) => {
    return data;
  });

  const discountTypes = [
    {
      label: t("percentage"),
      value: "1fe92aa8-2a61-4bf1-b907-182b497584ad",
    },
    {
      label: t("amount"),
      value: "9fb3ada6-a73b-4b81-9295-5c1605e54552",
    },
  ];

  const onDiscountAdd = () => {
    if (Object.keys(errors).length === 1) {
      addOrderDiscount({
        value: +(watch("percentage") || watch("amount")),
        type: watch("discountType"),
        order_id: order.id,
      }).then(() => {
        queryClient.invalidateQueries("order", order.id);
        onClose();
        reset();
      });
    }
  };

  return (
    <>
      <Button variant="link" onClick={onOpen} color="colors.link">
        {t("add")}
      </Button>
      <Drawer
        size="sm"
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading size="lg">{t("add_discount")}</Heading>}
        Body={
          <SimpleGrid gap="24px" mt="10px">
            <FormControl>
              <FormLabel color="colors.grey45" fontWeight={700}>
                {t("discount")}
              </FormLabel>
              <InputMask
                name={
                  initialDiscountType === watch("discountType")
                    ? "percentage"
                    : "amount"
                }
                control={control}
                errors={errors}
                inputProps={{
                  h: "52px",
                  bg: "colors.grayF9",
                  border: "none",
                  borderRadius: "10px",
                }}
                maskProps={{
                  placeholder: t("add_discount"),
                  mask:
                    initialDiscountType === watch("discountType")
                      ? "999"
                      : "9".repeat(`${getValues("orderAmount")}`.length),
                }}
                rightElementValue={
                  initialDiscountType === watch("discountType") && (
                    <Text mt="8px" fontWeight={700}>
                      %
                    </Text>
                  )
                }
              />
            </FormControl>
            <CustomSwitch
              options={discountTypes}
              active={getValues("discountType")}
              onChange={(val) => {
                setValue("discountType", val);
                setValue("percentage", "");
                setValue("amount", "");
              }}
            />
          </SimpleGrid>
        }
        Footer={
          <SimpleGrid columns={2} gap="24px" w="100%">
            <Button h="48px" colorScheme="gray" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button
              h="48px"
              color="#fff"
              onClick={() => {
                onSubmitHandle();
                onDiscountAdd();
              }}
            >
              {t("add")}
            </Button>
          </SimpleGrid>
        }
      />
    </>
  );
}

AddDiscount.propTypes = {
  orderAmount: PropTypes.number.isRequired,
};
