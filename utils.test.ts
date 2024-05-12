import { expect, test } from "vitest";
import { calculateFuturePeriods } from "./utils";

test("check empty calendar on calculateFuturePeriods", () => {
  const futurePeriods = calculateFuturePeriods([]);
  expect(futurePeriods).toStrictEqual([]);
});
