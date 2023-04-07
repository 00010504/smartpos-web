import PropTypes from "prop-types";
import { motion } from "framer-motion";

const map = {
  0: "first",
  1: "second",
  2: "third",
};

const variants = {
  first: {
    left: "0%",
  },
  second: {
    left: "33.3%",
  },
  third: {
    left: "66.6%",
  },
};

const getColor = (statement) => {
  if (statement) {
    return "text-white";
  }
  return "text-black";
};

export default function StepViewer({ steps, currStep }) {
  return (
    <div className="bg-[#f9f9f9] rounded-3xl flex relative">
      <motion.span
        variants={variants}
        initial="first"
        animate={map[currStep]}
        className="bg-[#256DF6] rounded-3xl w-1/3 absolute h-full"
      />
      {steps.map((step, i) => (
        <span
          key={step}
          className={`w-1/3 text-center py-1 z-10 transition-colors font-medium ${getColor(
            currStep === i,
          )}`}
          style={{
            padding: "12px",
            display: "block",
            fontWeight: 700,
            fontSize: "16px",
          }}
        >
          {step}
        </span>
      ))}
    </div>
  );
}

StepViewer.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currStep: PropTypes.number.isRequired,
};
