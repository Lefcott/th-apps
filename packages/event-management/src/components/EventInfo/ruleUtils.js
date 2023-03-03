/** @format */

export const setNthDate = (nthDates, byweekday) => {
  const newByweekday = byweekday.reduce((acc, day) => {
    nthDates.forEach((value) => {
      acc.push(day.nth(value));
    });
    return acc;
  }, []);

  return newByweekday;
};
