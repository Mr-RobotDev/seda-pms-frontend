import dayjs from 'dayjs';

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatDateTime = (isoString: string) => {
  const dateObj = dayjs(isoString);
  const formattedDate = dateObj.format('DD MMM, YYYY');
  const formattedTime = dateObj.format('h:mm A');
  return { formattedDate, formattedTime };
};

export function formatToTitleCase(input: string): string {
  const words = input.trim().split(/\s+/);

  const formattedWords = words.map(word => {
    if (word.length > 0) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word;
  });

  return formattedWords.join(' ');
}