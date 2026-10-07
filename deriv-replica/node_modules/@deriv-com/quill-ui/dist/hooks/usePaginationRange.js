import { useMemo as e } from "react";
const S = "...", T = (n, _) => {
  const A = _ - n + 1;
  return Array.from({ length: A }, (D, I) => I + n);
}, O = ({
  currentPage: n,
  totalPageCount: _,
  variant: A
}) => e(() => {
  if (A === "bullet")
    return T(1, _);
  if (_ >= 6) {
    const r = Math.max(n - 1, 1), R = Math.min(n + 1, _), i = r > 2, s = R <= _ - 2;
    if (!i && s)
      return [...T(
        1,
        5
      ), S, _];
    if (i && !s) {
      const E = T(
        _ - 5 + 1,
        _
      );
      return [1, S, ...E];
    }
    if (i && s) {
      const E = T(r, R);
      return [
        1,
        S,
        ...E,
        S,
        _
      ];
    }
  }
  return T(1, _);
}, [n, _, A]);
export {
  S as DOTS,
  O as UsePaginationRange
};
