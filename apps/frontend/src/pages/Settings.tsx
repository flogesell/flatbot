import React from 'react';
import { Overview } from '../components/dashboard/Overview';
import { Module } from '../components/Module';
import { PageTitle } from '../components/PageTitle';
import { Profile } from '../components/settings/Profile';

export const Settings = () => {
  return (
    <div>
      <PageTitle title="Settings" />
      <Module subTitle="Profile">
        <Profile />
      </Module>
      <Module subTitle="Flat">
        <Profile />
      </Module>
    </div>
  );
};
