import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Direct', value: 55 },
  { name: 'Social', value: 34 },
  { name: 'Other', value: 11 },
];

const COLORS = ['#FF9F43', '#4A90E2', '#F8F9FA'];

export function TrafficDonut() {
  return (
    <div className="h-[300px] bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Traffic</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}