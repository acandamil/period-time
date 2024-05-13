import { expect, test } from "vitest";
import {
  calculateFuturePeriods,
  calculateMedian,
  calculateMedianCicle,
  getDate,
  toJsonDate,
} from "./utils";

test("check empty calendar on calculateFuturePeriods", () => {
  const futurePeriods = calculateFuturePeriods([]);
  expect(futurePeriods).toStrictEqual([]);
});

test("check calculateFuturePeriods with 2 periods", () => {
  const period1 = {
    start: {
      year: 2024,
      month: 4,
      day: 3,
    },
    end: {
      year: 2024,
      month: 4,
      day: 4,
    },
  };
  const period2 = {
    start: {
      year: 2024,
      month: 4,
      day: 10,
    },
    end: {
      year: 2024,
      month: 4,
      day: 11,
    },
  };

  const futurePeriods = calculateFuturePeriods([period1, period2]);
  expect(futurePeriods[0].start).toStrictEqual({
    year: 2024,
    month: 4,
    day: 17,
  });
});

test("check calculateMedianCicle with 1 cicle", () => {
  const period1 = {
    start: {
      year: 2024,
      month: 4,
      day: 3,
    },
    end: {
      year: 2024,
      month: 4,
      day: 4,
    },
  };
  expect(calculateMedianCicle([period1])).toStrictEqual(28);
});

test("check calculateMediaCicle with 4 cicles", () => {
  const period1 = {
    start: {
      year: 2024,
      month: 4,
      day: 3,
    },
    end: {
      year: 2024,
      month: 4,
      day: 4,
    },
  };
  const period2 = {
    start: {
      year: 2024,
      month: 4,
      day: 10,
    },
    end: {
      year: 2024,
      month: 4,
      day: 11,
    },
  };
  const period3 = {
    start: {
      year: 2024,
      month: 4,
      day: 17,
    },
    end: {
      year: 2024,
      month: 4,
      day: 18,
    },
  };
  const period4 = {
    start: {
      year: 2024,
      month: 4,
      day: 19,
    },
    end: {
      year: 2024,
      month: 4,
      day: 20,
    },
  };
  expect(
    calculateMedianCicle([period1, period2, period3, period4])
  ).toStrictEqual(7);
});

test("check calculateMedian on a empty calendar", () => {
  expect(calculateMedian([])).toStrictEqual(5);
});

test("check calculateMedian with 2 periods", () => {
  const period1 = {
    start: {
      year: 2024,
      month: 4,
      day: 3,
    },
    end: {
      year: 2024,
      month: 4,
      day: 7,
    },
  };
  const period2 = {
    start: {
      year: 2024,
      month: 4,
      day: 10,
    },
    end: {
      year: 2024,
      month: 4,
      day: 14,
    },
  };
  expect(calculateMedian([period1, period2])).toStrictEqual(4);
});
test("check getDate", () => {
  const jsonDate = {
    year: 2024,
    month: 3,
    day: 21,
  };
  const date = new Date(2024, 3, 21, 1);
  expect(getDate(jsonDate)).toStrictEqual(date);
});

test("check toJsonDate", () => {
  const futurePeriods = calculateFuturePeriods([]);
  const jsonDate = {
    year: 2024,
    month: 3,
    day: 21,
  };
  const date = new Date(2024, 3, 22);
  expect(toJsonDate(date)).toStrictEqual(jsonDate);
});

test("from json date to date to json date", () => {
  const json = {
    year: 2024,
    month: 3,
    day: 21,
  };
  const date = getDate(json);
  const jsonTransform = toJsonDate(date);
  expect(jsonTransform).toStrictEqual(json);
});

test("from date to json date to date", () => {
  const date = new Date(2024, 3, 22, 1);
  const json = toJsonDate(date);
  const dateTransform = getDate(json);
  expect(dateTransform).toStrictEqual(date);
});
