import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import { getShopsQuery } from "@/queries";
import { downloadProducts } from "@/services";
import Select from "../molecules/Select/Select";

const values = {
  ids: [],
};
const schema = createSchema({
  ids: "multiselect",
});

function DownloadProducts({ isOpen, onClose }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useHookForm(values, schema);

  const { data: shopsData } = useQuery({
    ...getShopsQuery(),
  });

  const onSubmitHandle = handleSubmit((data) => {
    const ids = data.ids.map((item) => item.value);
    setLoading(true);

    downloadProducts({ ids }).then((res) => {
      const link = document.createElement("a");
      link.href = res.id;
      link.setAttribute("download", "example.xlsx");
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    });
  });

  useEffect(() => {
    if (shopsData) {
      const options = shopsData.data.map((shop) => {
        return { value: shop.id, label: shop.title };
      });

      setShops(options);
    }
  }, [shopsData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p="20px" bg="colors.body" borderRadius="20px">
        <ModalCloseButton />
        <Heading size="md" mb="32px">
          {t("download_products")}
        </Heading>
        <Select
          name="ids"
          control={control}
          errors={errors}
          label={t("store")}
          selectProps={{
            placeholder: t("select_country"),
            isMulti: true,
          }}
          options={shops}
        />
        <SimpleGrid columns={2} gap="24px" mt="32px">
          <Button color="#fff" colorScheme="gray" h="48px" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            color="#fff"
            h="48px"
            onClick={onSubmitHandle}
            isLoading={loading}
          >
            {t("download")}
          </Button>
        </SimpleGrid>
      </ModalContent>
    </Modal>
  );
}

export default DownloadProducts;

DownloadProducts.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
