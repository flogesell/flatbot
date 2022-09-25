import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, BarElement, Title, Tooltip, Legend, ScriptableContext } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { de } from 'date-fns/locale';
import { Box } from '@chakra-ui/react';
import { useGetExpensesQuery } from '../../services/expense.service';
import { useGetFlatQuery } from '../../services/flat.service';
import { Expense } from '../../models/expenses.model';

ChartJS.register(TimeScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = () => {
  const { data: expenses, isLoading: expensesLoading } = useGetExpensesQuery();
  const { data: flat, isLoading: flatLoading } = useGetFlatQuery();
  const [chart, setChart] = React.useState<ChartJS>();
  const chartReference = useRef<ChartJS>(null);

  const chartData = flat.flatmates.map((flatmate) => {
    return {
      label: flatmate.firstName,
      borderRadius: 5,
      backgroundColor: ['rgba(137, 107, 255, 0.3)'],
      /* backgroundColor: (context: ScriptableContext<'bar'>) => {
        const chartContext = context.chart.ctx;
        const gradient = chartContext.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, '#2193b0');
        gradient.addColorStop(1, '#6dd5ed');
        return gradient;
      }, */
      data: [expenses.filter((expense) => expense.paidById === flatmate.userId).reduce((acc, expense) => acc + expense.amount, 0)]
    };
  });

  useEffect(() => {
    console.log(chartReference.current?.data.datasets);
    console.log(chartData);
    console.log(chartReference.current);
  }, [expenses, flat, chart, chartData]);

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
        type: 'time'
      },
      y: {
        stacked: true,
        ticks: {
          callback: function (value, index, values) {
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
      <Chart ref={chartReference} type="bar" options={options} data={data} />
    </Box>
  );
};
