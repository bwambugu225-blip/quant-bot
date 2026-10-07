import l from "react";
import { c } from "../../clsx-OuTLNxxd.js";
import '../../assets/base2.css';const i = ({
  children: e,
  as: t = "p",
  centered: r = !1,
  className: o,
  ...p
}) => {
  const a = typeof t == "string" ? t : void 0;
  return l.createElement(
    a || "p",
    {
      className: c(
        "quill-typography",
        r && "quill-typography-centered",
        o
      ),
      ...p
    },
    e
  );
};
export {
  i as Typography
};
