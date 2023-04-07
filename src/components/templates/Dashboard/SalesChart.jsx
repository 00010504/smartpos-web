import { useState } from "react";
import shortenNum from "@/helpers/shortenNum";
import { Box, Flex, Image, IconButton, useColorMode } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types";
import filterDataset from "@/helpers/filterDataset";
import CharBarIcon from "@/assets/icons/chart-bar.svg";
import ChartLineIcon from "@/assets/icons/chart-line.svg";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "add": {
//       const portionInView = state.length;
//       return state.concat(fullDataset.slice(portionInView, portionInView + 1));
//     }

//     default: {
//       return state;
//     }
//   }
// };

// const colors = { "Gross sales": "#256DF6", "Net sales": "#4E9DEA" }; // EABE4E
const chart_modes = {
  line: "line",
  bar: "bar",
};

export default function SalesChart({
  dataset,
  figureKeys,
  byDate,
  selectedStore,
}) {
  // const [chartData, dispatchChartData] = useReducer(reducer, partialDataset);
  const [chartMode, setChartMode] = useState(chart_modes.line);

  const chartData = filterDataset({
    dataset,
    store: selectedStore || "All",
    byDate,
  });

  const { colorMode } = useColorMode();

  return (
    <Box
      bg="colors.body"
      p="20px 0"
      borderRadius="20px"
      // onClick={() => dispatchChartData({ type: "add" })}
    >
      <Flex justifyContent="right" gap="20px" pr="20px" mb="16px">
        <IconButton
          colorScheme="gray"
          variant="outline"
          border="2px solid #EFF0F6"
          width="40px"
          height="40px"
        >
          {chartMode === "line" ? (
            <Image
              src={ChartLineIcon}
              alt="line chart"
              onClick={() => setChartMode(chart_modes.bar)}
            />
          ) : (
            <Image
              src={CharBarIcon}
              alt="bar chart"
              onClick={() => setChartMode(chart_modes.line)}
            />
          )}
        </IconButton>
      </Flex>
      <ResponsiveContainer width="100%" height={300}>
        {chartMode === "line" ? (
          <LineChart
            width={640}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              stroke={colorMode === "light" ? "#EFF0F6" : "#2D3748"}
              vertical={false}
              strokeWidth={2}
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={shortenNum}
              fontSize="14px"
              fontWeight={500}
              color="#000"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            {figureKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke="#256DF6"
                strokeWidth="3"
                dot={false}
                // isAnimationActive={false}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart width={150} height={40} data={chartData}>
            <CartesianGrid
              stroke={colorMode === "light" ? "#EFF0F6" : "#2D3748"}
              vertical={false}
              strokeWidth={2}
            />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={shortenNum}
              fontSize="14px"
              fontWeight={500}
              color="#000"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            {figureKeys.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                fill="#256DF6"
                radius={[10, 10, 10, 10]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

SalesChart.defaultProps = {
  dataset: [],
  figureKeys: [],
};

SalesChart.propTypes = {
  dataset: PropTypes.arrayOf(PropTypes.shape({})),
  figureKeys: PropTypes.arrayOf(PropTypes.string),
  byDate: PropTypes.string.isRequired,
  selectedStore: PropTypes.string.isRequired,
};
