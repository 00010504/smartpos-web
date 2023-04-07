import { Center, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import sendImage from "@/helpers/uploadImage"; /* eslint-disable react/jsx-props-no-spreading */

export default function AvatarUpload({
  displayLetters,
  setSelectedImg,
  selectedImg,
  color,
}) {
  const [files, setFiles] = useState([]);
  const { t } = useTranslation();

  let handleChange;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      handleChange = () => {
        setSelectedImg(acceptedFiles[0]?.preview);
      };
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
    },
  });

  useEffect(() => {
    if (files[0]) {
      sendImage(files[0].preview).then((url) => {
        setSelectedImg(url.file_url);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const rootProps = getRootProps({ className: "dropzone" });
  const debouncedOnClick = useMemo(
    () => debounce(rootProps.onClick, 200),
    [rootProps.onClick],
  );

  const thumbs = files.map((file) => (
    <Center
      key={file.name}
      {...styles.nameBg}
      backgroundImage={`url(${file.preview})`}
    />
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack spacing={4} direction="column">
      {files.length !== 0 ? (
        thumbs
      ) : (
        <Center
          {...styles.nameBg}
          background={
            selectedImg ? `url(${selectedImg})` : color || "rgba(0,0,0,0.2)"
          }
        >
          {!selectedImg && <Text {...styles.nameText}>{displayLetters}</Text>}
        </Center>
      )}
      <Center
        {...rootProps}
        onClick={debouncedOnClick}
        {...styles.innerContainer}
      >
        <input onChange={handleChange} {...getInputProps()} />
        <Text color="brand.400">{t("upload")}</Text>
      </Center>
    </VStack>
  );
}

const styles = {
  image: {
    borderRadius: "full",
    boxSize: "120px",
    objectFit: "cover",
  },
  innerContainer: {
    bg: "colors.grayF9",
    rounded: "md",
    p: 1,
  },
  nameBg: {
    boxSize: "120px",
    bg: "colors.grayF9",
    borderRadius: "50%",
    backgroundSize: "cover",
  },
  nameText: {
    fontSize: "6xl",
    as: "b",
    pt: "10px",
    color: "#fff",
  },
};
AvatarUpload.defaultProps = {
  displayLetters: "",
  selectedImg: "",
  color: "",
};
AvatarUpload.propTypes = {
  displayLetters: PropTypes.string,
  setSelectedImg: PropTypes.func.isRequired,
  selectedImg: PropTypes.string,
  color: PropTypes.string,
};
