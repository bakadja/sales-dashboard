import supabase from '../supabase-client';
import { Suspense, lazy, useEffect, useState } from 'react';
import Form from '../components/Form';

const SalesChart = lazy(() => import('../components/SalesChart'));

function Dashboard() {
  type Metric = {
    name: string | null;
    sum: number | null;
  };

  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('sales_deals')
          .select(
            `
            value.sum(),
            ...user_profiles!inner(
              name
            )
            `,
          );
        if (error) {
          throw error;
        }
        setMetrics((data ?? []) as Metric[]);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching metrics:', message);
      }
    };

    fetchMetrics();

    const channel = supabase
      .channel('deal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sales_deals',
        },
        (payload: unknown) => {
          console.log(payload);
          fetchMetrics();
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const chartData = metrics.map((m) => ({
    name: m.name ?? 'Unknown',
    sum: m.sum ?? 0,
  }));

  const yMax = chartData.length
    ? Math.max(...chartData.map((m) => m.sum)) + 2000
    : 5000;

  return (
    <section className="dashboard-wrapper" aria-label="Sales dashboard">
      <section className="chart-container" aria-label="Sales chart and data">
        <h2>Total Sales This Quarter ($)</h2>
        <div style={{ flex: 1, minHeight: 320 }}>
          <Suspense fallback={<div>Loading chart...</div>}>
            <SalesChart data={chartData} yMax={yMax} />
          </Suspense>
        </div>
      </section>
      <Form />
    </section>
  );
}

export default Dashboard;
