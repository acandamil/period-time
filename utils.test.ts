import { expect, test } from "vitest";
import { calculateFuturePeriods } from "./utils";

test("check empty calendar on calculateFuturePeriods", () => {
  const futurePeriods = calculateFuturePeriods([]);
  expect(futurePeriods).toStrictEqual([]);
});

test("with 2 periods", () => {
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
