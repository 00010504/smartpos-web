import { useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useOutsideClick,
} from "@chakra-ui/react";
import GalleryIcon from "@/assets/icons/gallery.svg";
import UploadIcon from "@/assets/icons/upload.svg";
import MainAvatarIcon from "@/assets/icons/main-image.svg"; /* eslint-disable react/jsx-props-no-spreading */
import DocumentIcon from "@/assets/document.svg";
import useToast from "@/hooks/useToast";
import uploadValidator from "@/helpers/uploadValidator";
import { useTranslation } from "react-i18next";
import EyeIcon from "@/components/atoms/Icons/EyeIcon";

export const UPLOAD_TYPES = {
  image: "image",
  document: "document",
};

export default function Upload({
  filetype,
  shouldHaveMain,
  label,
  selectedFileIndex,
  onSelectAsMain,
  onOutsideClick,
  onSelect,
  onRemove,
  onDrop,
  files,
  styleProps,
}) {
  const ref = useRef(null);
  const { t } = useTranslation();
  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      validator: (f) =>
        uploadValidator(f, {
          max_size: 5_242_880,
          file_type: filetype,
        }),
    });

  useOutsideClick({
    ref,
    handler: onOutsideClick,
  });

  const { addToast } = useToast();

  useEffect(() => {
    if (fileRejections.length) {
      const lastRejection = fileRejections.at(-1);
      const title = `${lastRejection.errors[0].message}: ${lastRejection.file.name}`;
      addToast({
        title,
      });
    }
  }, [fileRejections, addToast]);

  return files.length ? (
    <Flex ref={ref} {...styles.imagesWrapper}>
      {files.map(({ preview, name }, i) => (
        <Flex
          key={preview || name}
          onClick={() => onSelect(i)}
          shadow={selectedFileIndex === i ? "outline" : "none"}
          {...styles.image}
          title={name}
          bg="colors.heading"
        >
          {i === 0 && filetype === UPLOAD_TYPES.image && (
            <Image src={MainAvatarIcon} {...styles.mainIcon} />
          )}
          {filetype === UPLOAD_TYPES.image && (
            <Image src={preview} alt="preview" maxH="100%" />
          )}
          {filetype === UPLOAD_TYPES.document && (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Image src={DocumentIcon} alt="document" maxH="100%" />
              <Text w="110px" p="2" pb={0} className="two-lines">
                {name}
              </Text>
              <a
                href={preview}
                className="cursor-pointer absolute right-0 top-1"
                target="_blank"
                rel="noreferrer"
              >
                <EyeIcon fill="colors.link" />
              </a>
            </Flex>
          )}
        </Flex>
      ))}

      <Flex {...styles.uploadButton} {...getRootProps()}>
        <input {...getInputProps()} />
        <Image src={UploadIcon} alt="upload" />
        {t("upload")}
      </Flex>

      <Flex {...styles.buttonsWrapper}>
        <Button
          color="tomato"
          {...styles.button}
          onClick={onRemove}
          bg="rgba(239, 68, 68, 0.1)"
        >
          {t("delete")}
        </Button>
        {shouldHaveMain && (
          <Button color="brand.500" {...styles.button} onClick={onSelectAsMain}>
            {t("select_as_main")}
          </Button>
        )}
      </Flex>
    </Flex>
  ) : (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      <Flex
        {...styles.dropzoneInput}
        {...styleProps}
        bg={
          isDragActive
            ? "repeating-linear-gradient(-55deg, grey.500, grey.500 10px, #e9e9e9 10px, #e9e9e9 20px)"
            : "colors.grayF9"
        }
        color="colors.text"
        borderColor="colors.sidebarBorder"
      >
        {filetype === UPLOAD_TYPES.image && (
          <Image src={GalleryIcon} alt="Gallery" mr="2" />
        )}
        {label}
        {isDragActive && t("drop_files_here")}
      </Flex>
    </Box>
  );
}

Upload.defaultProps = {
  filetype: UPLOAD_TYPES.image,
  label: "Drag or upload files here",
  selectedFileIndex: null,
  styleProps: {},
  onSelectAsMain: () => {},
  shouldHaveMain: true,
};

Upload.propTypes = {
  filetype: PropTypes.string,
  shouldHaveMain: PropTypes.bool,
  label: PropTypes.string,
  selectedFileIndex: PropTypes.number,
  onSelectAsMain: PropTypes.func,
  onOutsideClick: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  styleProps: PropTypes.shape({
    path: PropTypes.string,
    preview: PropTypes.string,
  }),
};

const styles = {
  imagesWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
  },
  image: {
    w: "110px",
    h: "110px",
    p: "2",
    alignItems: "center",
    justifyContent: "center",
    bg: "grey.500",
    rounded: "lg",
    position: "relative",
  },
  mainIcon: {
    alt: "Main",
    position: "absolute",
    top: "1",
    left: "1",
  },
  uploadButton: {
    flexDir: "column",
    alignItems: "center",
    justifyContent: "center",
    w: "110px",
    h: "110px",
    p: "2",
    bg: "colors.heading",
    rounded: "lg",
    color: "grey.800",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonsWrapper: {
    flexDir: "column",
    justifyContent: "space-between",
    w: "110px",
    h: "110px",
    rounded: "lg",
    ml: "auto",
    mr: "3",
  },
  button: {
    colorScheme: "grey",
    fontSize: "xs",
    h: "45px",
    width: "150px",
    bg: "colors.heading",
  },
  dropzoneInput: {
    justifyContent: "center",
    alignItems: "center",
    color: "#737373",
    h: "125px",
    border: "1px dashed #d9d9d9",
    borderRadius: "12px",
    userSelect: "none",
    cursor: "pointer",
  },
};
