/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  SimpleGrid,
  Switch,
} from "@chakra-ui/react";
import SectionHeader from "@/components/atoms/SectionHeader/SectionHeader";
import GoBack from "@/components/molecules/GoBack";
import CustomRadio from "@/components/molecules/CustomRadio";
import Input from "@/components/molecules/Input/Input";
import Select2 from "@/components/molecules/Select/Select";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
// import recieptImg from "@/assets/images/receipt.svg";
import useToast from "@/hooks/useToast";
import genSelectOptions from "@/helpers/genSelectOptions";
import {
  getPaymentType,
  getShops,
  getSingleCashbox,
  updateCashboxList,
  updateSingleCashbox,
  getReceipt,
} from "@/services";

const schema = createSchema({
  title: "default",
  shop_id: "select",
});

const values = {
  title: "",
  shop_id: "",
  payment_type_ids: [],
  receipt_id: "",
};

export default function CreateCashboxTemplate() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeReceiptId, setActiveReceiptId] = useState("");
  const [receiptType, setReceiptType] = useState([]);
  const [shopList, setShopList] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [isPaymentChecked, setPaymentChecked] = useState({});
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useHookForm(values, schema);

  const hydrateValues = async () => {
    // get all values
    if (!id) {
      const [shopsData, receiptData, paymentTypesData] = await Promise.all([
        getShops(),
        getReceipt(),
        getPaymentType(),
      ]);

      // get payments for switch
      const paymentData = paymentTypesData?.data?.map((payment) => ({
        ...payment,
        is_added: false,
      }));

      setPaymentType(paymentData);

      // get shops for select
      const shopOptions = genSelectOptions(shopsData.data, {
        valuePath: "id",
        labelPath: "title",
      });
      setShopList(shopOptions);

      // get receipts for radio
      const receiptOptions = genSelectOptions(receiptData.data, {
        valuePath: "id",
        labelPath: "name",
      });
      setReceiptType(receiptOptions);
    }

    // get for edit
    if (id) {
      const singleCashboxData = await getSingleCashbox(id);

      // get cashbox title
      setValue("title", singleCashboxData?.title);

      setValue("shop_id", {
        value: singleCashboxData?.shop?.id,
        label: singleCashboxData?.shop?.name,
      });

      // get shops for select
      const shopOptions = genSelectOptions(singleCashboxData.shops, {
        valuePath: "id",
        labelPath: "name",
      });
      setShopList(shopOptions);

      // get receipts for radio
      const receiptOptions = genSelectOptions(singleCashboxData.cheques, {
        valuePath: "id",
        labelPath: "name",
      });
      setReceiptType(receiptOptions);

      // set selected receipt
      setActiveReceiptId(singleCashboxData?.cheque_id);

      // get payment for switch
      setPaymentType(singleCashboxData?.payment_types);

      // get checked payment
      const addedPayment = {};
      singleCashboxData?.payment_type_ids?.forEach((paymentId) => {
        addedPayment[paymentId] = true;
      });
      setPaymentChecked(addedPayment);
    }
  };

  useEffect(() => {
    hydrateValues();
  }, []);

  const mutation = () => {
    if (id) {
      return updateSingleCashbox.bind(null, id);
    }
    return updateCashboxList;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cashboxes"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["stores"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["cashbox", id],
        refetchType: "all",
      });
      addToast({
        title: id
          ? `${t("cashbox")} ${t("edited_successfully")}`
          : `${t("cashbox")} ${t("created_successfully")}`,
        status: "success",
      });
      navigate("/settings/cashbox");
    },
    onError: (error) => {
      addToast({ title: error.data.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    const checkedPyamentIds = Object.keys(isPaymentChecked).reduce(
      (acc, curr) => {
        if (isPaymentChecked[curr]) {
          return acc.concat(curr);
        }
        return acc;
      },
      [],
    );
    const payload = {
      ...data,
      shop_id: data.shop_id.value,
      receipt_id: activeReceiptId,
      payment_type_ids: checkedPyamentIds,
    };
    mutate(payload);
  });

  return (
    <form onSubmit={onSubmit}>
      <GoBack
        title={id ? t("edit_cashbox") : t("create_cashbox")}
        backUrl="/settings/cashbox"
        rightElement={
          <Button
            w={120}
            height="45px"
            type="submit"
            isDisabled={!activeReceiptId}
            color="#fff"
          >
            {id ? t("save") : t("create")}
          </Button>
        }
        type="sticky"
      />

      <SimpleGrid gap="40px" mt={3}>
        <Box>
          <SectionHeader title="main" />
          <SimpleGrid gap="24px 30px" columns={2} mt={7}>
            <Input
              name="title"
              control={control}
              errors={errors}
              label={t("title")}
              inputProps={{
                placeholder: t("enter_title"),
                ...styles.inputStyles,
              }}
              formControlProps={{ py: 0.5 }}
            />
            <Select2
              name="shop_id"
              control={control}
              errors={errors}
              label="store"
              selectProps={{
                placeholder: t("select_store"),
                ...styles.inputStyles,
              }}
              options={[...shopList]}
            />
          </SimpleGrid>
        </Box>
        <Box>
          <SectionHeader title="payment_types" />
          <Box mt={7}>
            {paymentType.map((type) => (
              <Flex key={type.name} mb={2} justifyContent="space-between">
                <FormLabel htmlFor={type.name}>{type.name}</FormLabel>
                <Switch
                  id={type.id}
                  size="md"
                  onChange={(e) => {
                    setPaymentChecked({
                      ...isPaymentChecked,
                      [type.id]: e.target.checked,
                    });
                  }}
                  sx={{
                    "span.chakra-switch__track[data-checked]": {
                      backgroundColor: "brand.500",
                    },
                  }}
                  isChecked={isPaymentChecked[type.id]}
                />
              </Flex>
            ))}
          </Box>
        </Box>
        <Box>
          <SectionHeader title="reciept_type" />
          <Box mt={7}>
            <CustomRadio
              options={receiptType}
              onChange={(value) => {
                setActiveReceiptId(value);
              }}
              active={activeReceiptId}
              child={<> </>}
            />
          </Box>
        </Box>
      </SimpleGrid>
    </form>
  );
}

const styles = {
  inputStyles: {
    padding: "24px 15px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
    _placeholder: {
      color: "#BDBDBD !important",
    },
  },
};
