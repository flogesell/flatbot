import React from 'react';
import { ExpenseList } from '../components/dashboard/ExpenseList';
import { Overview } from '../components/dashboard/Overview';
import { Module } from '../components/Module';
import { PageTitle } from '../components/PageTitle';
import { useGetExpensesQuery } from '../services/expense.service';

export const Dashboard = () => {
  return (
    <div>
      <PageTitle title="Dashboard" />
      <Module noShadow>
        <Overview />
      </Module>
      <Module subTitle="Ausgaben" noShadow>
        <ExpenseList />
      </Module>
    </div>
  );
};
