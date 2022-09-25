import React from 'react';
import { Module } from '../components/Module';
import { PageTitle } from '../components/PageTitle';
import { BarChart } from '../components/statistics/BarChart';
import { DebtOverview } from '../components/statistics/DebtOverview';

export const Statistics = () => {
  return (
    <div>
      <PageTitle title="Statistics" />
      <Module noShadow>
        <DebtOverview />
      </Module>
      <Module subTitle="TEST">
        <BarChart />
      </Module>
    </div>
  );
};
