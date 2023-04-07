/* eslint-disable react/jsx-props-no-spreading */
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import DocumentIcon from "@/assets/file_upload.svg";
import uploadFileIcon from "@/assets/icons/upload-gray.svg";
import fileIcon from "@/assets/file.svg";
import editIcon from "@/assets/icons/edit.svg";
import useToast from "@/hooks/useToast";
import formatBytes from "@/helpers/formatBytes";
import uploadValidator from "@/helpers/uploadValidator";

const gradient = {
  dark: "repeating-linear-gradient(-55deg, #a9a9a9, #a9a9a9 10px, #999 10px, #999 20px)",
  light:
    "repeating-linear-gradient(-55deg, #f9f9f9, #f9f9f9 10px, #e9e9e9 10px, #e9e9e9 20px)",
};

export default function FileUpload({
  w,
  h,
  file,
  setFile,
  uploadType,
  onDrop,
}) {
  const { addToast } = useToast();
  const { t } = useTranslation();
  const onDropFile = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive, open, fileRejections } =
    useDropzone({
      onDrop: onDrop || onDropFile,
      noClick: true,
      validator: (f) =>
        uploadValidator(f, {
          max_size: 1073741824,
          file_type: uploadType,
        }),
      maxFiles: 1,
    });

  const icon = () => {
    switch (uploadType) {
      case "image":
        return uploadFileIcon;
      case "excel":
        return DocumentIcon;
      default:
        return uploadFileIcon;
    }
  };

  const color_mode = useColorModeValue(gradient.light, gradient.dark);

  let mainContent;

  const ext = file && uploadType === "excel" && file.name.split(".")[1];

  if (file) {
    mainContent = (
      <>
        {uploadType === "excel" && (
          <>
            <Image src={fileIcon} alt="file" w={10} height={10} mr="4" />
            <Flex flexDirection="column" justifyContent="center">
              <Text color="colors.text">{ext}</Text>
              <Text color="colors.text">{formatBytes(file.size)}</Text>
            </Flex>
            <Image
              src={editIcon}
              alt="edit icon"
              w={6}
              height={6}
              pos="absolute"
              bottom={3}
              right={3}
              cursor="pointer"
              onClick={open}
            />
          </>
        )}
        {uploadType === "image" && (
          <Image
            src={`${import.meta.env.VITE_CDN_URL}/${file}`}
            alt=""
            height="80px"
            objectFit="cover"
            borderRadius="10px"
          />
        )}
      </>
    );
  } else if (isDragActive) {
    mainContent = (
      <>
        <Image src={DocumentIcon} alt="file" w={10} height={10} mb="6" />
        <Text>Drop here</Text>
      </>
    );
  } else {
    mainContent = (
      <>
        <Image src={icon()} alt="file" w={10} height={10} mb="6" />
        {t("drag_the_file_to_this_area")}
        <Text>- {t("or")} -</Text>
        <Button variant="link">{t("click_for_an_upload")}</Button>
      </>
    );
  }

  const flexProps = {
    flexDirection: file ? "row" : "column",
    justifyContent: file || isDragActive ? "center" : "space-between",
    alignItems: "center",
  };

  const bg = isDragActive ? gradient[color_mode] : "colors.grayF9";

  useEffect(() => {
    if (fileRejections.length) {
      const lastRejection = fileRejections.at(-1);
      const title = `${lastRejection.errors[0].message}: ${lastRejection.file.name}`;
      addToast({
        title,
      });
    }
  }, [fileRejections, addToast]);

  return (
    <Box {...getRootProps()} w={w} height={h}>
      <input {...getInputProps()} />

      <Flex
        onClick={open}
        {...flexProps}
        p="6"
        color="#737373"
        h="full"
        rounded="xl"
        userSelect="none"
        bg={bg}
        cursor="pointer"
        pos="relative"
      >
        {mainContent}
      </Flex>
    </Box>
  );
}

FileUpload.defaultProps = {
  w: "auto",
  h: "auto",
  file: null,
  onDrop: null,
  setFile: () => {},
};

FileUpload.propTypes = {
  w: PropTypes.string,
  h: PropTypes.string,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setFile: PropTypes.func,
  uploadType: PropTypes.oneOf(["image", "excel"]).isRequired,
  onDrop: PropTypes.func,
};
