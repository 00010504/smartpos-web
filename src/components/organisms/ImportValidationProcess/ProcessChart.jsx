import { PieChart, Pie, ResponsiveContainer, Sector } from "recharts";
import PropTypes from "prop-types";

export const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={15}
        dx={4}
        textAnchor="middle"
        fill={payload.fill}
        fontSize={40}
        fontWeight={600}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={10}
      />
    </g>
  );
};

function ProcessChart({ percentage }) {
  const chartData = [
    { name: `${percentage}%`, value: percentage, fill: "#256DF6" },
    { name: "", value: 100 - percentage, fill: "#EAEAEA" },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={[0, 1]}
          cx="50%"
          cy="50%"
          activeShape={renderActiveShape}
          data={chartData}
          innerRadius={78}
          outerRadius={90}
          dataKey="value"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default ProcessChart;

ProcessChart.propTypes = {
  percentage: PropTypes.number.isRequired,
};
