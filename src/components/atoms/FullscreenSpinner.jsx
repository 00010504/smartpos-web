import PropTypes from "prop-types";

export default function FullScreenSpinner({ h, display }) {
  return (
    <div
      style={{
        height: h,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        display,
      }}
    >
      <span className="loader" />
    </div>
  );
}

FullScreenSpinner.defaultProps = {
  h: "100%",
  display: "flex",
};

FullScreenSpinner.propTypes = {
  h: PropTypes.string,
  display: PropTypes.string,
};
