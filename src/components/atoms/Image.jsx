import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Placeholder from "@/assets/images/icons/image-placeholder.svg";
import "react-lazy-load-image-component/src/effects/opacity.css";

function Image({ props, styles }) {
  return (
    <LazyLoadImage
      // eslint-disable-next-line react/prop-types
      src={props.src || Placeholder}
      effect="opacity"
      style={{
        borderRadius: "6px",
        ...styles,
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = Placeholder;
      }}
    />
  );
}

export default Image;

Image.defaultProps = {
  styles: {},
  props: {
    src: Placeholder,
    alt: "image",
  },
};

Image.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  props: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  // eslint-disable-next-line react/forbid-prop-types
  styles: PropTypes.object,
};
