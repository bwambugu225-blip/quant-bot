const r = (e, t) => e && t ? "italic-underline" : e ? "italic" : t ? "underline" : "default", n = (e) => e ? "bold" : "regular";
export {
  r as getTextDecoration,
  n as getTextWeight
};
