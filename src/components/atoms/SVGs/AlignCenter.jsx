import PropTypes from "prop-types";

function AlignCenter({ active }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4H18"
        stroke={active ? "white" : "#454545"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "all 0.15s",
        }}
      />
      <path
        d="M6 8H14"
        stroke={active ? "white" : "#454545"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "all 0.15s",
        }}
      />
      <path
        d="M3 12H18"
        stroke={active ? "white" : "#454545"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "all 0.15s",
        }}
      />
      <path
        d="M6 16H14"
        stroke={active ? "white" : "#454545"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: "all 0.15s",
        }}
      />
    </svg>
  );
}

export default AlignCenter;

AlignCenter.defaultProps = {
  active: false,
};

AlignCenter.propTypes = {
  active: PropTypes.bool,
};
