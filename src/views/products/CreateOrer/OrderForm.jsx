import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SimpleGrid } from "@chakra-ui/react";
import PropTypes from "prop-types";
import Select from "@/components/molecules/Select/Select";
import Input from "@/components/molecules/Input/Input";
import { getSuppliersQuery, getStoresQuery } from "@/queries";
import extractChildren from "@/helpers/extractChildren";
import genSelectOptions from "@/helpers/genSelectOptions";
import { getOrderStatus } from "@/services";

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

function OrderForm({ errors, control }) {
  const [suppliers, setSuppliers] = useState([]);
  const [stores, setStores] = useState([]);
  const [statuses, setStatuses] = useState([]);

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
    getOrderStatus().then((res) => {
      const options = genSelectOptions(res.data, {
        valuePath: "id",
        labelPath: "name",
      });
      setStatuses(options);
    });
  }, []);

  return (
    <SimpleGrid columns={4} mt={6} gap="30px">
      <Select
        name="supplier_id"
        errors={errors}
        control={control}
        label="Supplier"
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
        label="Store"
        options={stores ?? []}
        selectProps={{
          storesLoading,
        }}
        isRequired
      />
      <Select
        name="order_type_id"
        errors={errors}
        control={control}
        label="Order type"
        options={types ?? []}
        isRequired
      />
      <Input
        name="invoice_number"
        control={control}
        errors={errors}
        label="Agreement №"
        isRequired
        inputProps={{
          ...inputStyles,
          placeholder: "Agreement №",
        }}
      />
      <Input
        name="purchase_date"
        control={control}
        errors={errors}
        label="Purchase date"
        isRequired
        inputProps={{
          ...inputStyles,
          type: "date",
        }}
      />
      <Input
        name="expected_date"
        control={control}
        errors={errors}
        label="Expected date"
        isRequired
        inputProps={{
          ...inputStyles,
          type: "date",
        }}
      />
      <Select
        name="status"
        errors={errors}
        control={control}
        label="Status"
        options={statuses ?? []}
        isRequired
      />
    </SimpleGrid>
  );
}

export default OrderForm;

OrderForm.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  control: PropTypes.shape({}).isRequired,
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
