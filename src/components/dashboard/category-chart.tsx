'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(210, 40%, 50%)',
  'hsl(180, 40%, 50%)',
  'hsl(60, 70%, 50%)',
];

export function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const chartData = useMemo(() => {
    const expenses = transactions.filter((t) => t.amount < 0);
    const categoryTotals = expenses.reduce((acc, t) => {
      const category = t.category || 'Other';
      acc[category] = (acc[category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const chartConfig = useMemo(() => {
    return chartData.reduce((acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
      return acc;
    }, {} as any);
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    formatter={(value) => formatCurrency(value as number)}
                    hideLabel 
                  />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={2}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col gap-2 text-sm">
              {chartData.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig[item.name]?.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No expense data to display.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
