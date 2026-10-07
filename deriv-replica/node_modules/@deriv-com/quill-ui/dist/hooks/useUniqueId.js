import { useState as n, useMemo as c } from "react";
const s = {}, a = (t) => {
  const [o, u] = n(0);
  return c(() => {
    const e = s[t] || 0;
    s[t] = e + 1, u(s[t]);
  }, []), `${t}-${o}`;
};
export {
  a as default,
  a as useUniqueId
};
