import HomeIcon from '@mui/icons-material/Home';
import DnsIcon from '@mui/icons-material/Dns';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { Dashboard, Home, ShowChart } from '@mui/icons-material';
import { MenuCategory, MenuLink } from '../models/menu.type';

export const menuPoints: MenuLink[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <HomeIcon />
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />
  }
];

export const tabs: MenuLink[] = [
  {
    name: 'Dashboard',
    path: '/',
    icon: <Home />
  },
  {
    name: 'Statistics',
    path: '/statistic',
    icon: <ShowChart />
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <SettingsIcon />
  }
];
