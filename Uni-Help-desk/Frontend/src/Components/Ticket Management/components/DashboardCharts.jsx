import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";

function DashboardCharts({ tickets }) {
  const open = tickets.filter((t) => t.status === "Open").length;
  const progress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const closed = tickets.filter((t) => t.status === "Closed").length;

  const data = [
    { name: "Open", value: open || 0 },
    { name: "In Progress", value: progress || 0 },
    { name: "Resolved", value: resolved || 0 },
    { name: "Closed", value: closed || 0 },
  ];

  // soft pastel colors matching cards
  const COLORS = [
    "#34d399", // Open
    "#f472b6", // In Progress
    "#fbbf24", // Resolved
    "#f87171", // Closed
  ];

  return (
    <div className="row mt-4">
      {/* Bar Chart */}
      <div className="col-md-6">
        <div className="chart-box">
          <h5 className="mb-3">Bar Chart</h5>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="col-md-6">
        <div className="chart-box">
          <h5 className="mb-3">Pie Chart</h5>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCharts;