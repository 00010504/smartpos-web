/* eslint-disable no-param-reassign */
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCategoriesQuery,
  getShopsQuery,
  getMeasurementUnitsQuery,
} from "@/queries";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  HStack,
  CloseButton,
  Flex,
  Box,
  Divider,
  Input,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { uid } from "radash";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";
import parseParams from "@/helpers/parseParams";
import { customStyles } from "../molecules/Select/Select";

const createRow = () => ({
  id: uid(6),
  genericField: "",
  relation: "",
  specificField: "",
});

export default function TableFilter({ searchParams, setSearchParams }) {
  const [filters, setFilters] = useState([createRow()]);
  const { t } = useTranslation();

  const { data: categoryData } = useQuery(getCategoriesQuery());
  const { data: shopData } = useQuery(getShopsQuery());
  const { data: measurementData } = useQuery(getMeasurementUnitsQuery());

  const categories = useMemo(() => {
    return categoryData?.data.map((category) => ({
      label: category.name,
      value: category.id,
    })); // but there may be sub categories
  }, [categoryData]);

  const shops = useMemo(() => {
    return shopData?.data.map((shop) => ({
      label: shop.title,
      value: shop.id,
    }));
  }, [shopData]);

  const measurement_units = useMemo(() => {
    return measurementData?.data.map((unit) => ({
      label: unit.long_name,
      value: unit.id,
    }));
  }, [measurementData]);

  // console.log(categories, shops, measurement_units);

  const relations = [
    { label: t("equals"), value: "equals" },
    { label: t("does_not_equal"), value: "does_not_equal" },
    { label: t("greater_than"), value: "greater_than" },
    { label: t("is_less_than"), value: "is_less_than" },
  ];

  const genericFields = [
    { label: t("category"), value: "category" },
    { label: t("measurement_unit"), value: "measurement_unit" },
    { label: t("shop"), value: "shop" },
  ];

  const generic_field_ids = genericFields.map((field) => field.value);

  const specificFields = [];

  const addFilter = () => {
    setFilters((prev) => prev.concat(createRow()));
  };

  const removeFilter = (id) => {
    const filteredFilters = filters.filter((filter) => filter.id !== id);
    setFilters(filteredFilters);
  };

  const clearFilters = () => {
    const filtersCopy = cloneDeep(filters);
    filtersCopy.forEach((filter) => {
      filter.genericField = "";
      filter.relation = "";
      filter.specificField = "";
    });
    setFilters(filtersCopy);
  };

  const applyFilters = () => {
    const params = parseParams(searchParams);

    const validFilters = filters.filter(
      ({ genericField, relation, specificField }) => {
        return genericField && relation && specificField;
      },
    );

    const newParams = validFilters.reduce((acc, curr) => {}, {});

    setSearchParams({ ...params, newParams });
  };

  const inputChangeHandler = (id, updatePart) => {
    const filtersCopy = cloneDeep(filters);
    const filterIndex = filtersCopy.findIndex((filter) => filter.id === id);
    if (filterIndex !== -1) {
      filtersCopy[filterIndex] = { ...filtersCopy[filterIndex], ...updatePart };
      setFilters(filtersCopy);
    }
  };

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button h="45px" rightIcon={<ChevronDownIcon />}>
          Add filter
        </Button>
      </PopoverTrigger>
      <PopoverContent w="700px" h="330px">
        <PopoverBody h="100%">
          <Box h="80%" overflowY="scroll">
            {filters.map(({ id, genericField, relation, specificField }) => (
              <HStack key={id} my={4} p={2}>
                <Select
                  placeholder="generic field"
                  options={genericFields.concat(categories, measurement_units)}
                  value={genericField}
                  onChange={(option) => {
                    inputChangeHandler(id, {
                      genericField: option,
                      specificField: "",
                    });
                  }}
                  styles={selectStyles}
                />
                <Select
                  placeholder="relation field"
                  options={relations}
                  value={relation}
                  onChange={(option) => {
                    inputChangeHandler(id, { relation: option });
                  }}
                  styles={selectStyles}
                />

                {generic_field_ids.includes(genericField.value) ? (
                  <Select
                    placeholder="specific field"
                    options={
                      genericField.value === "shop"
                        ? specificFields.concat(shops)
                        : genericField.value === "measurement_unit"
                        ? specificFields.concat(measurement_units)
                        : specificFields.concat(categories)
                    }
                    value={specificField}
                    onChange={(option) => {
                      inputChangeHandler(id, { specificField: option });
                    }}
                    styles={selectStyles}
                  />
                ) : (
                  <Input
                    placeholder="specific field"
                    value={specificField}
                    onChange={(e) => {
                      inputChangeHandler(id, { specificField: e.target.value });
                    }}
                  />
                )}
                <CloseButton onClick={() => removeFilter(id)} />
              </HStack>
            ))}
          </Box>

          <Divider />
          <HStack justifyContent="space-between" h="20%" p={2}>
            <Button leftIcon={<AddIcon />} variant="ghost" onClick={addFilter}>
              Add filter
            </Button>
            <Flex gap={4}>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
              <Button onClick={applyFilters}>Enable filters</Button>
            </Flex>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

TableFilter.propTypes = {
  searchParams: PropTypes.shape({
    entries: PropTypes.func,
  }).isRequired,
  setSearchParams: PropTypes.func.isRequired,
};

const selectStyles = {
  ...customStyles,
  control: (provided) => ({
    ...provided,
    padding: "0",
    borderRadius: "0.375rem",
    borderColor: "e2e8f0",
    fontFamily: "Inter, sans-serif",
    height: "40px",
  }),
  option: (provided) => ({
    ...provided,
    fontFamily: "Inter, sans-serif",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "rgba(113, 128, 150, 0.7)",
  }),
};
