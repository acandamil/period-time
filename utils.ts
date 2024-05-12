import { JsonDate, Period } from "./types";

//Transform a JsonDate into a regular date
export const getDate = (date: JsonDate): Date =>
  new Date(Date.UTC(date.year, date.month, date.day));

//Transform a date into Jason date
export const toJsonDate = (date: Date): JsonDate => {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
};

export const getMillis = (date: JsonDate) => getDate(date).getTime();

//Calculate the median of the complete cicle, from day 1 of a period to day 1 of the next period
export function calculateMedianCicle(periods: Period[]): number {
  const sortedPeriods = periods.sort(
    (a, b) => getDate(b.start).getTime() - getDate(a.start).getTime()
  );
  //if there are less than 2 periods, it returns 28 which is the average cicle
  if (sortedPeriods.length < 2) {
    return 28;
  }
  var i = 0;
  const durations: number[] = [];
  if (sortedPeriods.length > 24) {
    i = sortedPeriods.length - 24;
  }
  while (i < sortedPeriods.length - 1) {
    const days = Math.ceil(
      (getMillis(sortedPeriods[i].start) -
        getMillis(sortedPeriods[i + 1].start)) /
        (24 * 60 * 60 * 1000)
    );
    durations.push(days);
    i++;
  }
  durations.sort((a, b) => a - b);

  const mid = Math.floor(durations.length / 2);

  if (durations.length % 2 === 0) {
    return Math.round((durations[mid - 1] + durations[mid]) / 2);
  } else {
    return durations[mid];
  }
}

//Calculate the median of the period (bleeding days)
export function calculateMedian(periods: Period[]): number {
  //if there are less than 2 periods, it returns 5
  if (periods.length < 1) {
    return 5;
  }
  const durations: number[] = [];

  for (let i = 0; i < periods.length; i++) {
    const days = Math.ceil(
      (getMillis(periods[i].end) - getMillis(periods[i].start)) /
        (24 * 60 * 60 * 1000)
    );
    durations.push(days);
  }

  durations.sort((a, b) => a - b);

  const mid = Math.floor(durations.length / 2);

  if (durations.length % 2 === 0) {
    return Math.round((durations[mid - 1] + durations[mid]) / 2);
  } else {
    return durations[mid];
  }
}

//From the already storage periods, the function makes an estimation of the next 12 periods
export const calculateFuturePeriods = (periods: Period[]) => {
  if (periods.length === 0) {
    return [];
  } else {
    const medianCicle = calculateMedianCicle(periods);
    const periodDuration = calculateMedian(periods);
    const lastPeriod = periods
      .sort((a, b) => getDate(a.start).getTime() - getDate(b.start).getTime())
      .at(-1);
    if (lastPeriod === undefined) {
      return [];
    } else {
      const futurePeriods: Period[] = [];
      for (let i = 1; i <= 12; i++) {
        const start = getDate(lastPeriod.start);
        start.setDate(start.getDate() + i * medianCicle);
        const end = new Date(start);
        end.setDate(end.getDate() + periodDuration);
        const nextPeriod = {
          start: toJsonDate(start),
          end: toJsonDate(end),
        };

        futurePeriods.push(nextPeriod);
      }
      return futurePeriods;
    }
  }
};

export const calculateDurationInDays = (start: Date, end: Date) => {
  const difference = end.getTime() - start.getTime();
  return Math.ceil(difference / (1000 * 60 * 60 * 24) + 1);
};
