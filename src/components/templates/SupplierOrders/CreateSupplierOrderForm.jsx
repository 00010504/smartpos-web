import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heading, SimpleGrid, Button } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getSuppliersQuery, getStoresQuery } from "@/queries";
import Drawer from "@/components/molecules/Drawer";
import Input from "@/components/molecules/Input/Input";
import Select from "@/components/molecules/Select/Select";
import extractChildren from "@/helpers/extractChildren";
import genSelectOptions from "@/helpers/genSelectOptions";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import useLatestClosure from "@/hooks/useLatestClosure";
import {
  createSupplierOrder,
  getSupplierOrder,
  updateSupplierOrder,
} from "@/services";
import useToast from "@/hooks/useToast";
import Textarea from "@/components/molecules/Textarea";

const initialValues = {
  supplier_id: "",
  shop_id: "",
  invoice_number: "",
  expected_date: "",
  note: "",
};

const schema = createSchema({
  supplier_id: "select",
  shop_id: "select",
  expected_date: "dateBiggerThanYesterday",
});

function CreateOrderFormDrawer({ isOpen, onClose, supplier_order_id }) {
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useHookForm(initialValues, schema);

  const mutation = () => {
    if (supplier_order_id) {
      return updateSupplierOrder.bind(null, supplier_order_id);
    }
    return createSupplierOrder;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({
        queryKey: ["supplier-orders"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["supplier-orders", supplier_order_id],
        refetchType: "all",
      });
      navigate(`/products/orders/edit-order/${res.id}`);
      addToast({ title: "Order created", status: "success" });
    },
    onError: (error) => {
      addToast({ title: error.data.error });
    },
  });

  const onSubmit = useLatestClosure(
    handleSubmit(async (data) => {
      const modifiedData = {
        ...data,
        supplier_id: data.supplier_id.value,
        shop_id: data.shop_id.value,
      };
      mutate(modifiedData);
    }),
  );

  const { data: suppliersData, isLoading: supplierLoading } = useQuery({
    ...getSuppliersQuery(),
  });

  const { data: storesData, isLoading: storesLoading } = useQuery({
    ...getStoresQuery(),
  });

  useEffect(() => {
    if (suppliersData) {
      const flattenedSuppliers = extractChildren(suppliersData.data);
      const options = genSelectOptions(flattenedSuppliers, {
        valuePath: "id",
        labelPath: "supplier_company_name",
      });
      setSuppliers(options);
    }
  }, [suppliersData]);

  useEffect(() => {
    if (storesData) {
      const flattenedStores = extractChildren(storesData.data);
      const options = genSelectOptions(flattenedStores, {
        valuePath: "id",
        labelPath: "title",
      });
      setStores(options);
    }
  }, [storesData]);

  useEffect(() => {
    if (supplier_order_id) {
      getSupplierOrder(supplier_order_id).then((res) => {
        const payload = {
          ...res,
          supplier_id: {
            value: res.supplier_name.id,
            label: res.supplier_name.name,
          },
          shop_id: {
            value: res.shop.id,
            label: res.shop.name,
          },
          purchase_date: res.created_date.split("T")[0],
          expected_date: res.expected_date.split("T")[0],
        };
        console.log(payload);
        reset(payload);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier_order_id]);

  return (
    <Drawer
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
      Header={<Heading size="lg">{t("new_order")}</Heading>}
      Body={
        <SimpleGrid gap="20px">
          <Select
            name="supplier_id"
            errors={errors}
            control={control}
            label={t("supplier")}
            options={suppliers ?? []}
            selectProps={{
              supplierLoading,
            }}
            isRequired
          />
          <Select
            name="shop_id"
            errors={errors}
            control={control}
            label={t("store")}
            options={stores ?? []}
            selectProps={{
              storesLoading,
            }}
            isRequired
          />
          <Input
            name="invoice_number"
            control={control}
            errors={errors}
            label={t("aggreement")}
            isRequired
            inputProps={{
              ...inputStyles,
              placeholder: t("aggreement"),
            }}
          />
          <Input
            name="expected_date"
            control={control}
            errors={errors}
            label={t("expected_date")}
            isRequired
            inputProps={{
              ...inputStyles,
              type: "date",
              min: new Date().toISOString().split("T")[0],
            }}
          />
          <Textarea
            name="note"
            control={control}
            errors={errors}
            label={t("comment")}
            textAreaProps={{
              ...inputStyles,
              height: "130px",
            }}
          />
        </SimpleGrid>
      }
      Footer={
        <SimpleGrid gridTemplateColumns="1fr 1fr" gap="30px" w="100%">
          <Button
            colorScheme="gray"
            h="50px"
            onClick={() => {
              onClose();
              reset();
            }}
          >
            {t("cancel")}
          </Button>
          <Button h="50px" onClick={onSubmit} color="#fff">
            {t("create")}
          </Button>
        </SimpleGrid>
      }
    />
  );
}

export default CreateOrderFormDrawer;

CreateOrderFormDrawer.defaultProps = {
  supplier_order_id: null,
};

CreateOrderFormDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  supplier_order_id: PropTypes.string,
};

export const inputStyles = {
  padding: "24px 15px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "500",
  _placeholder: {
    color: "#737373 !important",
  },
};
