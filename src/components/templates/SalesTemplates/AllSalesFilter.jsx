import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SimpleGrid,
  useDisclosure,
  Heading,
  Button,
  IconButton,
} from "@chakra-ui/react";
import Drawer from "@/components/molecules/Drawer";
import useHookForm from "@/hooks/useHookForm";
import { getClients, getShops } from "@/services";
import PropTypes from "prop-types";
import Select from "@/components/molecules/Select/Select";
import FilterIcon from "@/components/atoms/Icons/Filter";
import Input from "@/components/molecules/Input/Input";

const values = {
  shop_ids: [],
  client_ids: [],
  min_amount: "",
  max_amount: "",
  cashier_ids: [],
};

function AllSalesFilter({ params, setParams }) {
  const [shops, setShops] = useState([]);
  const [clients, setClients] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useHookForm(values);

  const onSubmit = handleSubmit((data) => {
    const modifiedData = {
      ...data,
      shop_ids: data.shop_ids.map(({ value }) => value).join(","),
      client_ids: data.client_ids.map(({ value }) => value).join(","),
      cashier_ids: data.cashier_ids.map(({ value }) => value).join(","),
    };

    setParams({ ...params, ...modifiedData });
    onClose();
  });

  useEffect(() => {
    getShops().then((res) => {
      const formattedShops = res.data.map((shop) => ({
        value: shop.id,
        label: shop.title,
      }));
      setShops([
        // { label: "All stores", value: "all-stores" },
        ...formattedShops,
      ]);
    });
    getClients().then((res) => {
      const fetchedClients = res.data.map(({ id, first_name, last_name }) => ({
        value: id,
        label: `${first_name} ${last_name}`,
      }));
      setClients([
        // { label: "All Clients", value: "all-clients" },
        ...fetchedClients,
      ]);
    });
  }, []);

  return (
    <>
      <IconButton
        marginTop={3}
        height="45px"
        width="48px"
        aria-label="Search database"
        icon={<FilterIcon color="#fff" transform="rotate(90deg)" />}
        borderRadius="10px"
        onClick={onOpen}
        mt="22px"
      />
      <Drawer
        Header={<Heading>{t("filter")}</Heading>}
        Body={
          <SimpleGrid mt={5} gap="24px">
            <Select
              name="shop_ids"
              errors={errors}
              control={control}
              label={t("stores")}
              options={shops ?? []}
              selectProps={{ isMulti: true }}
            />
            <Select
              name="client_ids"
              errors={errors}
              control={control}
              label={t("clients")}
              options={clients ?? []}
              selectProps={{ isMulti: true }}
            />

            <Input
              name="min_amount"
              control={control}
              errors={errors}
              label="From"
              inputProps={{ placeholder: "check_amount", type: "number" }}
            />
            <Input
              name="max_amount"
              control={control}
              errors={errors}
              label="To"
              inputProps={{ placeholder: "check_amount", type: "number" }}
            />

            <Select
              name="cashier_ids"
              errors={errors}
              control={control}
              label={t("cashier")}
              options={[]}
              selectProps={{ isMulti: true }}
            />
          </SimpleGrid>
        }
        Footer={
          <SimpleGrid width="100%" columns={2} gap="24px">
            <Button height="50px" colorScheme="gray" onClick={reset}>
              {t("reset")}
            </Button>
            <Button height="50px" onClick={onSubmit} color="#fff">
              {t("apply")}
            </Button>
          </SimpleGrid>
        }
        isOpen={isOpen}
        onClose={onClose}
        size="sm"
      />
    </>
  );
}

AllSalesFilter.propTypes = {
  params: PropTypes.shape({}).isRequired,
  setParams: PropTypes.func.isRequired,
};

export default AllSalesFilter;
