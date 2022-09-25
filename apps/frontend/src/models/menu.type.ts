export type MenuCategory = {
  categoryname: string;
  menulinks: MenuLink[];
};

export type MenuLink = {
  name: string;
  path: string;
  icon: any;
};
