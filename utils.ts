import { JsonDate, Period } from "./types";

export const getDate = (date: JsonDate): Date =>
  new Date(Date.UTC(date.year, date.month, date.day));

export const toJsonDate = (date: Date): JsonDate => {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    day: date.getUTCDate(),
  };
};

export const getMillis = (date: JsonDate) => getDate(date).getTime();

export function calculateMedianCicle(periods: Period[]): number {
  if (periods.length <= 2) {
    return 28;
  }
  var i = 0;
  const durations: number[] = [];
  if (periods.length > 24) {
    i = periods.length - 24;
  }
  while (i < periods.length - 1) {
    const days = Math.ceil(
      (getMillis(periods[i].start) - getMillis(periods[i + 1].start)) /
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
export function calculateMedian(periods: Period[]): number {
  if (periods.length <= 2) {
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
