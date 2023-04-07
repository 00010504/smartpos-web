import { Center, Image, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";

export default function Avatar({
  imageUrl,
  color,
  onClick,
  selectedImg,
  type,
  displayLetters,
  selectedColor,
}) {
  return (
    <Center
      {...styles.avatarBox}
      bg={color}
      onClick={onClick}
      border={color === selectedColor ? "3px solid #256DF6" : ""}
    >
      {type === "image" ? (
        <Image
          {...styles.avatarImg}
          src={imageUrl}
          borderColor={selectedImg === imageUrl ? "#256DF6" : "transparent"}
        />
      ) : (
        <Text {...styles.avatarText}>{displayLetters}</Text>
      )}
    </Center>
  );
}

Avatar.defaultProps = {
  imageUrl: "",
  color: "",
  displayLetters: "",
  selectedColor: "",
};
Avatar.propTypes = {
  type: PropTypes.oneOf(["image", "gradient"]).isRequired,
  imageUrl: PropTypes.string,
  color: PropTypes.string,
  displayLetters: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  selectedImg: PropTypes.string.isRequired,
  selectedColor: PropTypes.string,
};

const styles = {
  avatarBox: {
    boxSize: "90px",
    bg: "colors.grayF9",
    borderRadius: "50%",
    boxShadow: "inner",
  },
  avatarText: {
    fontSize: "5xl",
    color: "white",
    as: "b",
    pt: "8px",
  },
  avatarImg: {
    borderRadius: "full",
    boxSize: "85px",
    objectFit: "cover",
    alt: "",
    border: "3px solid transparent",
    padding: "2px",
  },
  selectedStyle: {
    border: "5px blue solid",
  },
};
