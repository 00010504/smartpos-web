import PropTypes from "prop-types";

function ItalicIcon({ active }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        style={{
          transition: "all 0.15s",
        }}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2.75C8 2.55109 8.07902 2.36032 8.21967 2.21967C8.36032 2.07902 8.55109 2 8.75 2H17.25C17.4489 2 17.6397 2.07902 17.7803 2.21967C17.921 2.36032 18 2.55109 18 2.75C18 2.94891 17.921 3.13968 17.7803 3.28033C17.6397 3.42098 17.4489 3.5 17.25 3.5H13.736L7.908 16.5H11.25C11.4489 16.5 11.6397 16.579 11.7803 16.7197C11.921 16.8603 12 17.0511 12 17.25C12 17.4489 11.921 17.6397 11.7803 17.7803C11.6397 17.921 11.4489 18 11.25 18H2.75C2.55109 18 2.36032 17.921 2.21967 17.7803C2.07902 17.6397 2 17.4489 2 17.25C2 17.0511 2.07902 16.8603 2.21967 16.7197C2.36032 16.579 2.55109 16.5 2.75 16.5H6.264L12.092 3.5H8.75C8.55109 3.5 8.36032 3.42098 8.21967 3.28033C8.07902 3.13968 8 2.94891 8 2.75Z"
        fill={active ? "white" : "#454545"}
      />
    </svg>
  );
}

export default ItalicIcon;

ItalicIcon.defaultProps = {
  active: false,
};

ItalicIcon.propTypes = {
  active: PropTypes.bool,
};
