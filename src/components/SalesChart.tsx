import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type SalesChartDatum = {
  name: string;
  sum: number;
};

type SalesChartProps = {
  data: SalesChartDatum[];
  yMax: number;
};

const SalesChart = ({ data, yMax }: SalesChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" interval={0} angle={-10} textAnchor="end" />
        <YAxis domain={[0, yMax]} />
        <Tooltip />
        <Bar dataKey="sum" fill="#58d675" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
