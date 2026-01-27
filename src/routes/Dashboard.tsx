import supabase from '../supabase-client';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Form from '../components/Form';
import type { Metric } from '../types/metrics';

function Dashboard() {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    fetchMetrics();

    // Subscribe to changes so the chart updates in real time.
    const channel = supabase
      .channel('deal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_deals',
        },
        payload => {
          console.log(payload);
          fetchMetrics();
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMetrics() {
    try {
      const { data, error } = await supabase.from('sales_deals').select(
        `
          name,
          value.sum()
          `
      );
      if (error) {
        throw error;
      }
      setMetrics((data ?? []) as Metric[]);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  }

  const chartData = [
    {
      data: metrics.map((m) => ({
        name: m.name,
        value: m.sum ?? 0,
      })),
    },
  ];

  function y_max() {
    if (metrics.length > 0) {
      const maxSum = Math.max(...metrics.map((m) => m.sum ?? 0));
      return maxSum + 2000;
    };
    return 5000;
  };

  return (
    <section className="dashboard-wrapper" aria-label="Sales dashboard">
      <section className="chart-container" aria-label="Sales chart and data">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1 }}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData[0].data}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, y_max()]} />
              <Tooltip />
              <Bar dataKey="value" fill="#58d675" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <Form metrics={metrics} />
    </section>
  );
};

export default Dashboard;
