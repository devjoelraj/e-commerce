import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StackedBarChart = ({ data, xKey, barKeys, title, stacked = false }) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {title && <h3 style={{ marginBottom: "20px" }}>{title}</h3>}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />

          {barKeys.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              stackId={stacked ? "a" : undefined}
              fill={bar.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
