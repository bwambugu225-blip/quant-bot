import { useContext as o } from "react";
import { ThemeContext as m } from "../../providers/theme/themeContext.js";
const s = () => {
  const { theme: e, toggleTheme: t } = o(m);
  return { theme: e, toggleTheme: t };
};
export {
  s as UseTheme,
  s as default
};
