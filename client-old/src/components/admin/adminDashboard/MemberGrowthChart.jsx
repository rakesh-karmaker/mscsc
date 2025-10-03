import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const MemberGrowthChart = ({ data }) => {
  // Prepare chart data
  const chartData = data?.memberGrowth || [];
  const maxCount = Math.max(...chartData.map((item) => item.count), 0);
  const yAxisMax = Math.floor(Math.ceil(maxCount * 1.3)); // 30% breathing space

  return (
    <div className="w-full h-fit !py-5 !pr-5 rounded-lg mb-6 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]  flex flex-col gap-6">
      <h2 className="font-medium px-5 mb-2 !pl-5">Member Registrations</h2>
      <div
        className="chart-scroll-container w-full"
        style={{ maxWidth: "calc(100vw - 5rem)", overflowX: "auto" }}
      >
        <div style={{ minWidth: 700, height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.map((item) => ({
                name: new Date(item.date).toLocaleString("en-US", {
                  month: "short",
                }),
                registers: item.count,
              }))}
              margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              // barSize={35}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, yAxisMax]} />
              <Tooltip />
              <Legend />
              <Line
                // type="monotone"
                strokeWidth={1.2}
                dataKey="registers"
                fill="rgb(59, 130, 246)"
                activeBar={<Rectangle fill="var(--color-primary)" />}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
