import { Tabs, TabList } from '@chakra-ui/react';
import React from 'react';
import { tabs } from '../../utils/Menustructure';
import { TabButton } from './TabButton';

export const TabMenu = () => {
  return (
    <Tabs className="tab-menu">
      <TabList className="tab-list">
        {tabs.map((tab) => (
          <TabButton key={tab.path} path={tab.path} label={tab.name} icon={tab.icon} />
        ))}
        {/* <TabButton label="Menu" icon={<Menu />} /> */}
      </TabList>
    </Tabs>
  );
};
