import { forwardRef, useEffect } from "react";
import RCCountUp from "react-countup";
import PropTypes from "prop-types";

const CountUpItem = forwardRef(({ start, in: showStatistics }, ref) => {
  useEffect(() => {
    if (showStatistics) {
      start();
    }
  }, [showStatistics, start]);

  return <span ref={ref} style={{ fontVariant: "tabular-nums" }} />;
});

function CountUp({ in: booleanState, ...props }) {
  return (
    <RCCountUp
      formattingFn={(value) =>
        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      }
      {...props}
    >
      {({ countUpRef, start }) => (
        <CountUpInstance ref={countUpRef} start={start} in={booleanState} />
      )}
    </RCCountUp>
  );
}

CountUp.propTypes = {
  in: PropTypes.bool.isRequired,
};

CountUpItem.propTypes = {
  start: PropTypes.func.isRequired,
  in: PropTypes.bool.isRequired,
};

const CountUpInstance = forwardRef((props, ref) => (
  <CountUpItem ref={ref} {...props} />
));

export default CountUp;
export { CountUpInstance };
