import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const SalesSummaryChart = React.memo(({ chartData }) => {
  const data = useMemo(() => chartData, [chartData]);

  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Sales Summary</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="weeks" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="pastWeek"
            stroke="#8a64f0"
            strokeWidth={2}
          />

          <Line
            type="monotone"
            dataKey="presentWeek"
            stroke="#64c2f0"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SalesSummaryChart;
