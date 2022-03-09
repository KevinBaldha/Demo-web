const menus = [
  {
    _name: 'CSidebarNavItem',
    name: 'WFH',
    to: '/wfh/list',
    icon: 'cil-house',
    roles: ['admin']
  },
  {
    _name: 'CSidebarNavDropdown',
    name: 'User',
    to: '/user/list',
    icon: 'cil-user',
    roles: ['admin'],
    items: [
      {
        name: 'Create',
        to: '/user/create'
      },
      {
        name: 'List',
        to: '/user/list'
      },
    ]
  },
  {
    _name: 'CSidebarNavDropdown',
    name: 'WFH',
    to: '/wfh/list',
    icon: 'cil-house',
    roles: ['employee'],
    items: [
      {
        name: 'Create',
        to: '/wfh/create'
      },
      {
        name: 'List',
        to: '/wfh/list'
      },
    ]
  }
]; 

export default menus;