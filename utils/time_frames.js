import dayjs from 'dayjs';

const timeFrames = {
  TODAY: {
    startDate: dayjs().startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'TODAY',
    title: 'Today',
  },
  YESTERDAY: {
    startDate: dayjs().subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().subtract(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'YESTERDAY',
    title: 'Yesterday',
  },
  THIS_WEEK: {
    startDate: dayjs().startOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'THIS_WEEK',
    title: 'This Week',
  },
  LAST_WEEK: {
    startDate: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'LAST_WEEK',
    title: 'Last Week',
  },
  LAST_3_DAYS: {
    startDate: dayjs().subtract(2, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'LAST_3_DAYS',
    title: 'Last 3 days',
  },
  LAST_7_DAYS: {
    startDate: dayjs().subtract(6, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'LAST_7_DAYS',
    title: 'Last 7 days',
  },
  LAST_30_DAYS: {
    startDate: dayjs().subtract(29, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    endDate: dayjs().endOf('day').format('YYYY-MM-DDTHH:mm:ss[Z]'),
    key: 'LAST_30_DAYS',
    title: 'Last 30 days',
  },
  CUSTOM: {
    startDate: '',
    endDate: '',
    key: 'CUSTOM',
    title: 'Custom',
  },
};

export default timeFrames;
