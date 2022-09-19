import HomeIcon from '@mui/icons-material/Home';
import DnsIcon from '@mui/icons-material/Dns';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { MenuCategory } from '../models/menu.type';

export const menuPoints: MenuCategory[] = [
  {
    categoryname: '',
    menulinks: [
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
    ]
  },
  {
    categoryname: '%COMPANYNAME%',
    menulinks: [
      {
        name: 'Cluster',
        path: '/cluster',
        icon: <AccountTreeIcon />
      },
      {
        name: 'Server',
        path: '/server',
        icon: <DnsIcon />
      },
      {
        name: 'Employees',
        path: '/company',
        icon: <GroupIcon />
      }
    ]
  }
];
