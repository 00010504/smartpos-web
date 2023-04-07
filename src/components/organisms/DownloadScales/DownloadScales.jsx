import { useState, useEffect } from "react";
import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import PropTypes from "prop-types";
import useHookForm from "@/hooks/useHookForm";
import createSchema from "@/helpers/createSchema";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getShopsQuery, getTemplatesQuery } from "@/queries";
import Select from "@/components/molecules/Select/Select";
import { getScalesTemplate } from "@/services";
import Drawer from "../../molecules/Drawer";
import NewScale from "./NewScale";

const values = {
  ids: [],
  id: "",
};

const schema = createSchema({
  shop_id: "select",
  // id: "select",
});

const handleDownload = (url) => {
  console.log(url);
  // const link = document.createElement("a");
  // link.href = url;
  // link.setAttribute("download", "example.xlsx");
  // document.body.appendChild(link);
  // link.click();
};

function DownloadScales({ isOpen, onClose }) {
  const [shops, setShops] = useState([]);
  const [templates, setTemplates] = useState([]);
  const { t } = useTranslation();

  const {
    isOpen: isModalOpen,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();

  const { data: shopsData } = useQuery({
    ...getShopsQuery(),
  });

  const { data: templatesData, refetch: refetchTemplates } = useQuery({
    ...getTemplatesQuery(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useHookForm(values, schema);

  const onSubmit = handleSubmit((data) => {
    const payload = {
      shop_id: data.shop_id.value,
      id: data.id.value,
    };
    getScalesTemplate(payload.id, payload).then((res) => {
      handleDownload(res.url);
    });
  });

  const createNew = () => {
    openModal();
  };

  useEffect(() => {
    if (shopsData) {
      const options = shopsData.data.map((shop) => {
        return { value: shop.id, label: shop.title };
      });

      setShops(options);
    }
  }, [shopsData]);

  useEffect(() => {
    if (templatesData) {
      const options = templatesData.scales_templates.map((template) => {
        return { value: template.id, label: template.name };
      });

      setTemplates(options);
    }
  }, [templatesData]);

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        Header={<Heading size="lg">Download</Heading>}
        Body={
          <form onSubmit={onSubmit} id="download-form">
            <br />
            <Flex flexDir="column" gap={6}>
              <Select
                name="shop_id"
                errors={errors}
                control={control}
                label={t("store")}
                options={shops}
                isRequired
              />
              <Select
                name="id"
                errors={errors}
                control={control}
                label={t("templates")}
                options={templates}
                isRequired
              />
            </Flex>
          </form>
        }
        Footer={
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap={6}
            w="100%"
          >
            <Button
              colorScheme="gray"
              color="brand.500"
              type="button"
              w="100%"
              py="6"
              onClick={createNew}
            >
              {t("create_new")}
            </Button>
            <Button
              type="submit"
              form="download-form"
              w="100%"
              py="6"
              color="#fff"
            >
              {t("download")}
            </Button>
          </Flex>
        }
        onCloseComplete={onClose}
      />
      <NewScale
        isOpen={isModalOpen}
        onClose={closeModal}
        refetchTemplates={refetchTemplates}
      />
    </>
  );
}

export default DownloadScales;

DownloadScales.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
