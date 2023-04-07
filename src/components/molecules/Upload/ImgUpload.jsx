import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { debounce } from "lodash";
import PropTypes from "prop-types";
import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Resize from "@/components/atoms/Resize";
import "./style.css";
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */

export default function ImgUpload({
  setImg,
  label,
  img,
  logoSize,
  onChangeSize,
  onChangePosition,
  deleteImage,
}) {
  const [files, setFiles] = useState([]);
  let handleChange;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      handleChange = (event) => {
        event.stopPropagation();
        setImg(acceptedFiles[0]?.preview);
      };
      setFiles(
        acceptedFiles.map((file) => {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        }),
      );

      setImg(acceptedFiles[0].preview);
    },
  });

  const defaultSizes = {
    x: logoSize?.left,
    y: logoSize?.top,
    width: logoSize?.right || "100%",
    height: logoSize?.bottom || 120,
  };

  const rootProps = getRootProps({ className: "dropzone" });
  const debouncedOnClick = useMemo(
    () => debounce(rootProps.onClick, 200),
    [rootProps.onClick],
  );
  const thumbs = files.map((file) => (
    <Box
      key={file.name}
      width={900}
      height={!logoSize?.bottom ? 120 : `${logoSize.bottom + 20}px`}
      className="parentDiv"
      overflow="visible"
      position="relative"
    >
      <Resize
        maxSize={css.maxSize}
        defaultSizes={defaultSizes}
        onChange={(sizes) => {
          onChangeSize(sizes);
        }}
        onChangePosition={(sizes) => {
          onChangePosition(sizes);
        }}
        child={
          <>
            <Image
              src={file.preview}
              id="container"
              draggable={false}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
              {...css.image}
            />
            <Flex
              {...css.icons}
              transition="
              visibility 0.3s ease-in-out,
            "
            >
              <EditIcon
                {...css.icon}
                {...rootProps}
                onClick={debouncedOnClick}
              />
              <DeleteIcon {...css.icon} color="red.300" onClick={deleteImage} />
            </Flex>
          </>
        }
      />
    </Box>
  ));

  useEffect(() => {
    setFiles([{ name: img, preview: img }]);
  }, [img]);

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Box bg={files.length === 0 && "grey.500"} rounded="lg">
      <Center h="100%" w="100%">
        {files.length !== 0 ? (
          thumbs
        ) : (
          <Center>
            <Text>{label}</Text>
          </Center>
        )}
        <input onChange={handleChange} {...getInputProps()} />
      </Center>
    </Box>
  );
}

ImgUpload.defaultProps = {
  setImg: () => {},
  img: "",
  label: "",
  setLogoSize: () => {},
};
ImgUpload.propTypes = {
  setImg: PropTypes.func,
  img: PropTypes.string,
  label: PropTypes.string,
  setLogoSize: PropTypes.func,
  onChangeSize: PropTypes.func.isRequired,
  onChangePosition: PropTypes.func.isRequired,
  deleteImage: PropTypes.func.isRequired,
  logoSize: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

const css = {
  icons: {
    gap: "12px",
    position: "absolute",
    top: "50%",
    right: "50%",
    transform: "translate(50%, -50%)",
    background: "rgba(0,0,0,0.5)",
    p: "8px 10px",
    backdropFilter: "blur( 3px )",
    borderRadius: "4px",
    visibility: "hidden",
    className: "action-icons",
  },
  icon: {
    color: "colors.header",
    outline: "none !important",
    cursor: "pointer",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "100%",
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  maxSize: {
    width: 264,
    height: 150,
  },
};
