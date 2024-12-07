import React from "react";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function Devices({ stats }) {
  const deviceCount = stats.reduce((acc, item) => {
    if (!acc[item.device]) {
      acc[item.device] = 0;
    }
    acc[item.device]++;
    return acc;
  }, {});
  const result = Object.keys(deviceCount).map((device) => ({
    device,
    count: deviceCount[device],
  }));
  return (
    <div>
      <PieChart width={700} height={400}>
        <Pie
          data={result}
          dataKey="count"
          labelLine={false}
          label={({ device, percent }) =>
            `${device}: ${(percent * 100).toFixed(0)}%`
          }
        />
        {result.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </PieChart>
    </div>
  );
}
