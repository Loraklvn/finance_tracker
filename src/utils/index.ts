export const validatePageParams = (
  page?: number,
  pageSize?: number,
): boolean => {
  return !!page && !!pageSize && page >= 1 && pageSize >= 1;
};

export const validateDates = (dates: string[]): boolean => {
  return dates.every((date) => new Date(date).toString() !== 'Invalid Date');
};
