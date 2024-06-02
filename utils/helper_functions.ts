export const activeSidebar = (path: string): string => {
  const routes = [
    { name: 'floor', path: '/dashboard/floor' },
    { name: 'users', path: '/dashboard/users' },
    { name: 'devices', path: '/dashboard/devices' },
    { name: 'alerts', path: '/dashboard/alerts' },
    { name: 'data-sources', path: '/dashboard/data-sources' },
    { name: 'profile', path: '/dashboard/profile' },
    { name: 'dashboard', path: '/dashboard' },
  ];

  for (const route of routes) {
    if (path.startsWith(route.path)) {
      return route.name;
    }
  }

  return '';
};