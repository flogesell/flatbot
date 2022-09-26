import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend, ScriptableContext } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';
import { Box } from '@chakra-ui/react';
import { useGetExpensesQuery } from '../../services/expense.service';
import { useGetFlatQuery } from '../../services/flat.service';
import { Expense } from '../../models/expenses.model';

ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

const getMonthlyExpenses = (flatmateId: string, expenses: Expense[]) => {
  const groupedData: { x: string; y: number }[] = [];
  const filteredExpenses = expenses.filter((expense: Expense) => expense.paidById === flatmateId);
  filteredExpenses.map((expense: Expense) => {
    const month = format(new Date(expense.date), 'yyyy-MM');
    const existingData = groupedData.find((data) => format(new Date(data.x), 'yyyy-MM') === month);
    if (existingData) {
      existingData.y += expense.amount;
    } else {
      groupedData.push({ x: month, y: expense.amount });
    }
  });
  return groupedData;
};

export const BarChart = () => {
  const { data: expenses, isLoading: expensesLoading } = useGetExpensesQuery();
  const { data: flat, isLoading: flatLoading } = useGetFlatQuery();
  const [chart, setChart] = React.useState<ChartJS>();
  const chartReference = useRef<ChartJS>(null);

  const gradients = [
    { start: '#f12711', end: '#f5af19' },
    { start: '#2193b0', end: '#6dd5ed' },
    { start: '#f12711', end: '#f5af19' },
    { start: '#f12711', end: '#f5af19' },
    { start: '#f12711', end: '#f5af19' }
  ];

  const chartData = flat.flatmates.map((flatmate, index) => {
    return {
      label: flatmate.firstName,
      borderRadius: 5,
      backgroundColor: (context: ScriptableContext<'bar'>) => {
        const chartContext = context.chart.ctx;
        const gradient = chartContext.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, gradients[index].start);
        gradient.addColorStop(1, gradients[index].end);
        return gradient;
      },
      data: getMonthlyExpenses(flatmate.userId, expenses)
    };
  });

  useEffect(() => {}, [expenses, flat, chart, chartData]);

  const options = {
    plugins: {
      title: {
        display: false
      }
    },
    padding: {
      right: 20
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        type: 'time',
        min: format(subMonths(new Date(), 3), 'yyyy-MM')
      },
      y: {
        stacked: true,
        ticks: {
          callback: function (value: number) {
            return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
          }
        }
      }
    }
  };
  const data = {
    datasets: chartData
  };
  return (
    <Box minHeight="300px" padding="10px">
      <Chart type="bar" options={options} data={data} />
    </Box>
  );
};
