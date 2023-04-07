import PropTypes from "prop-types";

function BoldIcon({ active }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1874_7009)">
        <path
          d="M5.8335 4.16669H10.8335C11.607 4.16669 12.3489 4.47398 12.8959 5.02096C13.4429 5.56794 13.7502 6.30981 13.7502 7.08335C13.7502 7.8569 13.4429 8.59877 12.8959 9.14575C12.3489 9.69273 11.607 10 10.8335 10H5.8335V4.16669Z"
          stroke={active ? "white" : "black"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "all 0.15s",
          }}
        />
        <path
          d="M10.8335 10H11.6668C12.4404 10 13.1822 10.3073 13.7292 10.8543C14.2762 11.4013 14.5835 12.1431 14.5835 12.9167C14.5835 13.6902 14.2762 14.4321 13.7292 14.9791C13.1822 15.526 12.4404 15.8333 11.6668 15.8333H5.8335V10"
          stroke={active ? "white" : "black"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "all 0.15s",
          }}
        />
      </g>
      <defs>
        <clipPath id="clip0_1874_7009">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default BoldIcon;

BoldIcon.defaultProps = {
  active: false,
};

BoldIcon.propTypes = {
  active: PropTypes.bool,
};
