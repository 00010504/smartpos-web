import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { SimpleGrid } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import DateRangePicker from "@/components/molecules/DateRangePicker/DateRangePicker";
import createSchema from "@/helpers/createSchema";
import useHookForm from "@/hooks/useHookForm";
import Select from "@/components/molecules/Select/Select";
import extractChildren from "@/helpers/extractChildren";
import genSelectOptions from "@/helpers/genSelectOptions";
import {
  getEmployeesQuery,
  getStoresQuery,
  getSuppliersQuery,
} from "@/queries";
import { supplierOrderStatusOptions } from "./data";

const initialValues = {
  status_id: "",
  shop_id: "",
  supplier_id: "",
  employee: "",
};

const schema = createSchema({});

let dateFrom, dateTo;

function SupplierFilters({ params, setSearchParams, changeParams, range }) {
  const [stores, setStores] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { t } = useTranslation();

  const { control } = useHookForm(initialValues, schema);

  const { data: storesData } = useQuery({
    ...getStoresQuery(),
  });

  const { data: suppliersData } = useQuery({
    ...getSuppliersQuery(),
  });

  const { data: employeesData } = useQuery({
    ...getEmployeesQuery(params),
  });

  const onRangeChange = (e) => {
    const { startDate, endDate } = e.selection;

    if (startDate && endDate) {
      // && endDate - startDate !== 0
      dateFrom = new Date(startDate);
      dateTo = new Date(endDate);

      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      const clonedParams = {
        ...params,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      };

      changeParams(clonedParams);
      setSearchParams(clonedParams);
      return;
    }

    dateFrom = "";
    dateTo = "";

    const clonedParams = {
      ...params,
      start_date: "",
      end_date: "",
    };

    changeParams(clonedParams);
    setSearchParams(clonedParams);
  };

  useEffect(() => {
    if (storesData) {
      const flattenedStores = extractChildren(storesData.data);
      const options = genSelectOptions(flattenedStores, {
        valuePath: "id",
        labelPath: "title",
      });
      options.unshift({ value: "", label: t("all") });
      setStores(options);
    }
  }, [storesData, t]);

  useEffect(() => {
    if (suppliersData) {
      const flattenedSuppliers = extractChildren(suppliersData.data);
      const options = genSelectOptions(flattenedSuppliers, {
        valuePath: "id",
        labelPath: "supplier_company_name",
      });
      options.unshift({ value: "", label: t("all") });
      setSuppliers(options);
    }
  }, [suppliersData, t]);

  useEffect(() => {
    if (employeesData) {
      const employeesOptions = employeesData?.employees.map((employee) => ({
        value: employee.user.id,
        label: `${employee.user.first_name} ${employee.user.last_name}`,
      }));
      employeesOptions.unshift({ value: "", label: t("all") });
      setEmployees(employeesOptions);
    }
  }, [employeesData, t]);

  return (
    <SimpleGrid mb={8} columns={5} alignItems="center" gap="20px">
      <Select
        name="status_id"
        errors={{}}
        control={control}
        options={supplierOrderStatusOptions}
        selectProps={{
          placeholder: t("status"),
          value: supplierOrderStatusOptions.filter(
            (option) => params.status_id === option.value,
          ),
          onChange: (e) => changeParams({ ...params, status_id: e.value }),
        }}
      />
      <Select
        name="shop_id"
        errors={{}}
        control={control}
        options={stores}
        selectProps={{
          placeholder: t("store"),
          value: stores.filter((option) => params.shop_id === option.value),
          onChange: (e) => changeParams({ ...params, shop_id: e.value }),
        }}
      />
      <Select
        name="supplier_id"
        errors={{}}
        control={control}
        options={suppliers}
        selectProps={{
          placeholder: t("supplier"),
          value: suppliers.filter(
            (option) => params.supplier_id === option.value,
          ),
          onChange: (e) => changeParams({ ...params, supplier_id: e.value }),
        }}
      />
      <Select
        name="created_by"
        errors={{}}
        control={control}
        options={employees}
        selectProps={{
          placeholder: t("employee"),
          value: employees.filter(
            (option) => params.created_by === option.value,
          ),
          onChange: (e) => changeParams({ ...params, created_by: e.value }),
        }}
      />
      <DateRangePicker
        selectionRange={{
          startDate: dateFrom ?? range.date_from,
          endDate: dateTo ?? range.date_to,
          key: "selection",
        }}
        onChange={onRangeChange}
      />
    </SimpleGrid>
  );
}

export default SupplierFilters;

SupplierFilters.propTypes = {
  setSearchParams: PropTypes.func.isRequired,
  params: PropTypes.shape({
    status_id: PropTypes.string,
    shop_id: PropTypes.string,
    supplier_id: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    created_by: PropTypes.string,
  }).isRequired,
  changeParams: PropTypes.func.isRequired,
  range: PropTypes.shape({
    date_from: PropTypes.instanceOf(Date),
    date_to: PropTypes.instanceOf(Date),
  }).isRequired,
};
