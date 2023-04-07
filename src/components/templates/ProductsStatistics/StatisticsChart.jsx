import { PieChart, Pie, ResponsiveContainer } from "recharts";
import { chartData, renderActiveShape } from "./data";

function StatisticsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart width={1000} height={1000}>
        <Pie
          activeIndex={[0, 1, 2, 3, 4]}
          activeShape={renderActiveShape}
          data={chartData}
          cy="40%"
          innerRadius={40}
          outerRadius={90}
          fill="#00E595"
          dataKey="value"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default StatisticsChart;
