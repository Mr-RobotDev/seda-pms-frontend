export const activeSidebar = (path: string): string => {
  const routes = [
    { name: 'floor', path: '/dashboard/floor' },
    { name: 'users', path: '/dashboard/users' },
    { name: 'devices', path: '/dashboard/devices' },
    { name: 'alerts', path: '/dashboard/alerts' },
    { name: 'data-sources', path: '/dashboard/data-sources' },
    { name: 'profile', path: '/dashboard/profile' },
    { name: 'reports', path: '/dashboard/reports' },
    { name: 'dashboard', path: '/dashboard' },
  ];

  for (const route of routes) {
    if (path.startsWith(route.path)) {
      return route.name;
    }
  }

  return '';
};

export const validateEmail = (email: string): boolean => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}

export const isValidTimeFormat = (time: string): boolean =>  {
  const timeRegex: RegExp = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return false;
  }

  const [hours, minutes] = time.split(':');
  const parsedHours: number = parseInt(hours, 10);
  const parsedMinutes: number = parseInt(minutes, 10);

  if (parsedHours < 0 || parsedHours > 24 || parsedMinutes < 0 || parsedMinutes > 59) {
    return false;
  }

  return true; 
}