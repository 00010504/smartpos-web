import PropTypes from "prop-types";

function LockIcon({ active }) {
  const fill = active ? "#256DF6" : "#BDBDBD";

  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="56" height="56" rx="15" fill={fill} />
      <g clipPath="url(#clip0_706_5130)">
        <path
          d="M34.25 26.75H21.75C20.3693 26.75 19.25 27.8693 19.25 29.25V36.75C19.25 38.1307 20.3693 39.25 21.75 39.25H34.25C35.6307 39.25 36.75 38.1307 36.75 36.75V29.25C36.75 27.8693 35.6307 26.75 34.25 26.75Z"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 34.25C28.6904 34.25 29.25 33.6904 29.25 33C29.25 32.3096 28.6904 31.75 28 31.75C27.3096 31.75 26.75 32.3096 26.75 33C26.75 33.6904 27.3096 34.25 28 34.25Z"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23 26.75V21.75C23 20.4239 23.5268 19.1521 24.4645 18.2145C25.4021 17.2768 26.6739 16.75 28 16.75C29.3261 16.75 30.5979 17.2768 31.5355 18.2145C32.4732 19.1521 33 20.4239 33 21.75V26.75"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_706_5130">
          <rect
            width="30"
            height="30"
            fill="white"
            transform="translate(13 13)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default LockIcon;

LockIcon.defaultProps = {
  active: false,
};

LockIcon.propTypes = {
  active: PropTypes.bool,
};
