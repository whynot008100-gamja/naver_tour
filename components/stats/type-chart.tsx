'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TypeChartProps {
  data: Array<{
    code: string;
    name: string;
    count: number;
  }>;
}

const COLORS = [
  'hsl(220 70% 50%)',  // 파랑
  'hsl(160 60% 45%)',  // 청록
  'hsl(30 80% 55%)',   // 주황
  'hsl(280 60% 50%)',  // 보라
  'hsl(120 40% 50%)',  // 초록
  'hsl(0 70% 50%)',    // 빨강
  'hsl(45 90% 55%)',   // 노랑
];

export function TypeChart({ data }: TypeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>타입별 분포</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
