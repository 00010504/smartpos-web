import { useEffect } from "react";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useToast from "@/hooks/useToast";
import {
  createSupplierOrder,
  getSupplierOrder,
  updateSupplierOrder,
} from "@/services";
import useLatestClosure from "@/hooks/useLatestClosure";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import OrderForm from "./OrderForm";
import OrderProducts from "./OrderProducts";

const initialValues = {
  supplier_id: "",
  shop_id: "",
  order_type_id: "",
  invoice_number: "",
  purchase_date: "",
  expected_date: "",
  status: "",
  items: [],
};

export const schema = createSchema({
  supplier_id: "select",
  shop_id: "select",
  order_type_id: "select",
  status: "select",
});

const types = [
  {
    value: "4c60818f-29be-45df-9860-c7f2fe94d91d",
    label: "Order",
  },
  {
    value: "4d990284-425b-4602-ab65-ebd8436b3ebd",
    label: "Return",
  },
];

function CreateOrder() {
  const queryClient = useQueryClient();
  const { supplier_order_id } = useParams();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useHookForm(initialValues, schema);

  const mutation = () => {
    if (supplier_order_id) {
      return updateSupplierOrder.bind(null, supplier_order_id);
    }
    return createSupplierOrder;
  };

  const { mutate } = useMutation(mutation(), {
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["supplier-orders"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["supplier-orders", supplier_order_id],
        refetchType: "all",
      });
      navigate("/products/orders");
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
        status: data.status.value,
        order_type_id: data.order_type_id.value,
        items: data.items.map((item) => ({
          ...item,
          cost: parseFloat(item.cost),
          discount: parseFloat(item.discount),
          expected_amount: parseFloat(item.expected_amount),
          tax: parseFloat(item.tax),
        })),
      };
      mutate(modifiedData);
    }),
  );

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
          status: {
            value: res.status.id,
            label: res.status.name,
          },
          order_type_id: {
            value: res.order_type_id,
            label: types.filter((type) => type.value === res.order_type_id)[0]
              .label,
          },
          purchase_date: res.purchase_date.split("T")[0],
          expected_date: res.expected_date.split("T")[0],
          // order_type_id: {
          //   value: res.order_type.id,
          //   label: typesOptions.filter(
          //     (type) => type.value === res.order_type.id,
          //   )[0].label,
          // },
        };
        reset(payload);
      });
    }
  }, [supplier_order_id, setValue, reset]);

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading fontWeight="600" fontSize="28px" mb={3}>
          Create Purchase
        </Heading>
        <Button w="100px" height="45px" onClick={onSubmit} color="#fff">
          Create
        </Button>
      </Flex>
      <OrderForm control={control} errors={errors} />
      <OrderProducts
        control={control}
        errors={errors}
        setValue={setValue}
        getValues={watch}
        watch={watch}
      />
    </>
  );
}

export default CreateOrder;
