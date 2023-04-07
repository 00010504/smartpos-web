import { Sector } from "recharts";

export const chartData = [
  { name: "35000", value: 35000, fill: "#0017D1", unitType: "kg" },
  { name: "18000", value: 18000, fill: "#00E595", unitType: "kg" },
  { name: "24000", value: 24000, fill: "#7239EA", unitType: "kg" },
  { name: "28000", value: 28000, fill: "#FFC700", unitType: "kg" },
  { name: "30000", value: 30000, fill: "#003F5C", unitType: "liters" },
];

export const initialData = { statistics: {} };

export const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth="6px"
        cornerRadius={10}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius - 3}
        outerRadius={outerRadius + 10}
        fill="#f5f5f5"
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey + 5}
        textAnchor={textAnchor}
        fill="#333"
        fontWeight="700"
        fontSize="18px"
      >
        {`${payload.name}`}{" "}
        <tspan fontSize="15px" fill="#BEBEBE" fontWeight={400}>
          {payload.unitType}
        </tspan>
      </text>
    </g>
  );
};
