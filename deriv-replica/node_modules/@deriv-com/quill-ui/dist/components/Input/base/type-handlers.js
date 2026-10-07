const s = (e) => {
  const a = ((l) => {
    let t = String(l).replace(/[^+\-\d.]/g, "");
    if (/^[+-]/.test(t) && (t = t.replace(/(?!^)[+-]/g, "")), t.includes(".")) {
      const c = t.split(".");
      t = c.shift() + "." + c.join("");
    }
    return t;
  })(e), o = /^[+-]?(\d+(\.\d*)?|\.\d+)?$/, r = a.match(o);
  return r ? r[0] : "";
}, d = (e) => {
  const n = String(e).replace(",", ".");
  return s(n);
}, i = {
  barrier: s,
  commaRemoval: d
}, p = (e, n) => i[e](n);
export {
  i as CustomTypeObject,
  s as barrierHandler,
  d as commaRemovalHandler,
  p as customHandlers
};
