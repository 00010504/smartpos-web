import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Box,
  Heading,
  SimpleGrid,
  FormControl,
  Image,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormLabel,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import DeleteIcon from "@/assets/icons/delete-circle.svg";
import CloseModalIcon from "@/assets/close-modal.svg";
import FileUpload from "@/components/molecules/Upload/FileUpload";
import { getLayersQuery } from "@/queries";
import sendImage from "@/helpers/uploadImage";
import { sidebarsCss as css, selectStyles } from "./data";

function Layers({ layers, changeLayer, deleteLayer, selectedItem, contents }) {
  const [selectedLayer, setSelectedLayer] = useState([]);
  const [selectedField, setSelectedField] = useState([]);
  const [imageType, setImageType] = useState("");
  const [image, setImage] = useState(null);
  const { t } = useTranslation();

  const { data } = useQuery({
    ...getLayersQuery(),
  });

  const fields = data?.fields?.map((field) => ({
    value: field.name,
    label: field.name,
  }));

  const fieldsForSelect = fields?.filter(
    (field) => contents[field.value] === undefined,
  );

  const layersOptions = [
    { value: "text", label: t("text") },
    { value: "image", label: t("image") },
    { value: "barcode", label: t("barcode") },
  ];

  useEffect(() => {
    (async () => {
      if (image && image[0]?.preview) {
        const res = await sendImage(image[0].preview);
        setImage(res.file_name);
      }
    })();
  }, [image]);

  return (
    <Box
      borderRight="3px solid"
      borderColor="colors.sidebarBorder"
      position="relative"
    >
      <Heading {...css.title}>{t("layers")}</Heading>
      <SimpleGrid {...css.body}>
        <FormControl>
          <Select
            styles={selectStyles}
            placeholder={t("select_the_property")}
            options={layersOptions}
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e)}
          />
        </FormControl>
        {layers.map((layer) => (
          <Box
            key={layer.id}
            {...css.property}
            border="3px solid"
            borderColor={
              selectedItem.value?.field_name === layer.id
                ? "colors.link"
                : "#E9E9E9"
            }
            onClick={() => {
              selectedItem.onChange(contents[layer.id]);
            }}
          >
            {layer.name}
            <Button
              variant="link"
              onClick={() => deleteLayer(layer.id)}
              {...css.deleteIcon}
            >
              <Image src={DeleteIcon} />
            </Button>
          </Box>
        ))}
        {layers.length === 0 && (
          <Text {...css.noLayer}>{t("no_layers_yet")}</Text>
        )}
      </SimpleGrid>

      <Modal
        isOpen={!!selectedLayer.value}
        onClose={() => {
          setSelectedLayer("");
          setSelectedField("");
          setImageType("");
          setImage(null);
        }}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent {...css.modalContent}>
          <ModalHeader>
            <Heading {...css.modalHeader}>
              {selectedLayer.value === "text" && t("text_option")}
              {selectedLayer.value === "image" && t("image_option")}
              {selectedLayer.value === "barcode" && t("barcode_option")}
            </Heading>
          </ModalHeader>
          <Button
            {...css.modalCloseButton}
            onClick={() => setSelectedLayer("")}
          >
            <Image src={CloseModalIcon} />
          </Button>
          <ModalBody position="relative">
            {(selectedLayer.value === "text" ||
              selectedLayer.value === "barcode") && (
              <FormControl>
                <FormLabel>{t("type")}</FormLabel>
                <Select
                  styles={selectStyles}
                  placeholder={t("select_the_property")}
                  options={fieldsForSelect}
                  value={selectedField}
                  onChange={(e) => setSelectedField(e)}
                />
              </FormControl>
            )}
            {selectedLayer.value === "image" && (
              <FormControl>
                <RadioGroup
                  display="grid"
                  gridTemplateColumns="1fr 1fr"
                  onChange={(type) => {
                    setImageType(type);
                    setSelectedField("image");
                  }}
                  value={imageType}
                  mb="20px"
                  mt="8px"
                >
                  <Radio size="lg" value="logo" gap="5px">
                    {t("logo")}
                  </Radio>
                  <Radio size="lg" value="product" gap="5px">
                    {t("product_photo")}
                  </Radio>
                </RadioGroup>
                {imageType === "logo" && (
                  <FileUpload
                    uploadType="image"
                    file={typeof image === "string" ? image : null}
                    onDrop={(acceptedFiles) => {
                      setImage(
                        acceptedFiles.map((file) =>
                          Object.assign(file, {
                            preview: URL.createObjectURL(file),
                          }),
                        ),
                      );
                    }}
                  />
                )}
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter {...css.modalFooter}>
            <Button
              {...css.modalButton}
              onClick={() => {
                setSelectedLayer("");
                setSelectedField("");
                setImageType("");
                setImage(null);
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              height="50px"
              color="#fff"
              onClick={() => {
                if (selectedField) {
                  changeLayer(
                    selectedField.value,
                    selectedLayer.value,
                    fields,
                    image,
                  );
                  setSelectedLayer("");
                  setSelectedField("");
                  setImageType("");
                  setImage(null);
                }
              }}
            >
              {t("apply")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Layers;

Layers.defaultProps = {
  layers: [],
};

Layers.propTypes = {
  layers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  changeLayer: PropTypes.func.isRequired,
  deleteLayer: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  contents: PropTypes.shape({}),
  selectedItem: PropTypes.shape({
    value: PropTypes.shape({
      field_name: PropTypes.string,
    }),
    onChange: PropTypes.func,
  }).isRequired,
};
